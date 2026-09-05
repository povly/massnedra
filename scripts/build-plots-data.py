#!/usr/bin/env python3
"""Собирает src/js/data/plots.ts из двух источников:
1. xlsx с полигонами участков (ГСК-2011, DMS) — аргумент командной строки;
2. scripts/plots-site.json — карточки со massnedra.com/investicionnye-proekty/.

Запуск: uv run --with openpyxl python3 scripts/build-plots-data.py <путь-к-xlsx>
"""
import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
SITE_JSON = ROOT / 'scripts' / 'plots-site.json'
OUT_TS = ROOT / 'src' / 'js' / 'data' / 'plots.ts'

# Расхождения имён xlsx -> карточки сайта (для substring-матча)
ALIASES = {
    'дергарсы': 'дергасы',
    'пластунский': 'пластонский',
    'колонковый': 'колонковский',
}

FILLER_WORDS = re.compile(
    r'\b(поисковая|площадь|участок|мр|горнорудный|рудник|гок|горнодобывающий|месторождение)\b'
)


def norm(s: str) -> str:
    s = s.lower().replace('ё', 'е')
    s = re.sub(r'[^a-zа-я0-9 ]+', ' ', s).strip()
    return FILLER_WORDS.sub(' ', s).strip()


def dms_to_decimal(line: str):
    """'53\t30\t41.4430\t099\t20\t26.0250' -> (lat, lon) в десятичных градусах."""
    parts = [p.strip().replace(',', '.') for p in line.split('\t')]
    if len(parts) < 6:
        return None
    lat_d, lat_m, lat_s, lon_d, lon_m, lon_s = (float(p) for p in parts[:6])
    return (
        lat_d + lat_m / 60 + lat_s / 3600,
        lon_d + lon_m / 60 + lon_s / 3600,
    )


def parse_xlsx(path: str):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.worksheets[0]
    plots = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        name, region, location, area, minerals, coords = row
        if not name:
            continue
        polygon = []
        for line in str(coords or '').split('\n'):
            point = dms_to_decimal(line.strip())
            if point:
                polygon.append(point)
        minerals_list = [
            m.strip() for m in re.split(r'[,;]', str(minerals or '')) if m.strip()
        ]
        plots.append({
            'name': str(name).strip(),
            'key': norm(ALIASES.get(norm(str(name)), norm(str(name)))),
            'region': str(region).strip(),
            'location': str(location or '').strip(),
            'area': float(str(area).replace(',', '.')) if area else None,
            'minerals': minerals_list,
            'polygon': polygon if len(polygon) >= 3 else None,
        })
    return plots


def parse_card_desc(desc: str):
    """Площадь, район и ископаемые из описания карточки."""
    # «км\n2» — разорванная надстрочная двойка в «км²»
    desc = re.sub(r'км\s*\n\s*2\b', 'км2', desc)
    area = None
    m = re.search(r'Площадь:?\s*([\d.,]+)\s*км', desc, re.IGNORECASE)
    if m:
        area = float(m.group(1).replace(' ', '').replace(',', '.'))
    location = ''
    loc_m = re.search(r'Местоположение:\s*([^\n]+)', desc)
    if loc_m:
        location = loc_m.group(1).strip()
    else:
        # строка между площадью и "Полезные ископаемые"
        lines = [l.strip() for l in desc.split('\n') if l.strip()]
        for i, l in enumerate(lines):
            if 'Площадь' in l and i + 1 < len(lines):
                nxt = lines[i + 1]
                if 'Полезные' not in nxt and 'км' not in nxt and not re.match(r'^2$', nxt.strip()):
                    location = nxt
                break
    minerals = []
    min_m = re.search(r'Полезные ископаемы[^:]*:\s*([\s\S]+)$', desc, re.IGNORECASE)
    if min_m:
        minerals = [x.strip() for x in re.split(r'[,;]', min_m.group(1)) if x.strip()]
    return area, location, minerals


def resolve_xlsx(path_arg: str) -> str:
    """Прямой путь может не совпасть по Unicode-нормализации имени — фолбэк на glob."""
    p = Path(path_arg)
    if p.exists():
        return str(p)
    candidates = [
        f for f in p.parent.glob('*.xlsx') if not f.name.startswith('.~lock')
    ]
    if len(candidates) == 1:
        return str(candidates[0])
    if candidates:
        target = path_arg.replace('\u0301', '')
        best = max(candidates, key=lambda f: _common_suffix(f.name, p.name))
        return str(best)
    sys.exit(f'xlsx не найден: {path_arg}')


def _common_suffix(a: str, b: str) -> int:
    n = 0
    for ca, cb in zip(reversed(a), reversed(b)):
        if ca != cb:
            break
        n += 1
    return n


def main():
    if len(sys.argv) < 2:
        sys.exit('Использование: build-plots-data.py <объекты.xlsx>')
    xlsx_plots = parse_xlsx(resolve_xlsx(sys.argv[1]))
    cards = json.loads(SITE_JSON.read_text(encoding='utf-8'))

    plots = []
    used_cards = set()
    used_xlsx = set()

    # Разрезаем объединённые карточки на отдельные участки
    flat_cards = []
    for card in cards:
        tokens = [t.strip() for t in card['title'].split('|') if t.strip()]
        area, loc_from_desc, minerals_from_desc = parse_card_desc(card['desc'])
        for token in tokens:
            flat_cards.append({
                'card': card,
                'token': token,
                'area': area,
                'location': loc_from_desc,
                'minerals': minerals_from_desc,
            })

    # 1) Участки из xlsx: полигон + данные xlsx, анкета сайта (номер/регион/url)
    for xp in xlsx_plots:
        card = None
        token = None
        for fc in flat_cards:
            key = norm(fc['token'])
            if xp['key'] in key or key in xp['key']:
                card, token = fc, fc['token']
                used_cards.add(id(fc))
                break
        if card is None:
            # участок из xlsx без карточки на сайте
            plots.append({
                'name': xp['name'],
                'region': xp['region'],
                'location': xp['location'],
                'area': xp['area'],
                'minerals': xp['minerals'],
                    'polygon': xp['polygon'],
            })
            used_xlsx.add(xp['name'])
            continue
        num_m = re.search(r'№\s*([\dА-Яа-яA-Za-z]+)', token)
        plots.append({
            'name': token,
            'region': card['card']['region'],
            'location': xp['location'] or card['location'],
            'area': xp['area'] or card['area'],
            'minerals': xp['minerals'] or card['minerals'],
            'polygon': xp['polygon'],
        })
        used_xlsx.add(xp['name'])

    # 2) Карточки без полигона в xlsx
    for fc in flat_cards:
        if id(fc) in used_cards:
            continue
        card = fc['card']
        num_m = re.search(r'№\s*([\dА-Яа-яA-Za-z]+)', fc['token'])
        area, loc_from_desc, minerals_from_desc = parse_card_desc(card['desc'])
        plots.append({
            'name': fc['token'],
            'region': card['region'],
            'location': loc_from_desc,
            'area': fc['area'] or area,
            'minerals': fc['minerals'] or minerals_from_desc,
            'polygon': None,
        })

    def sort_key(p):
        num = re.search(r'№\s*(\d+)', p['name'])
        num_part = f"{int(num.group(1)):04d}" if num else "9999"
        return (p['region'], num_part)


    # Дубли: карточка без полигона, чьё имя пересекается с участком с полигоном
    poly_keys = [norm(p['name']) for p in plots if p['polygon']]
    plots = [
        p for p in plots
        if p['polygon'] or not any(
            norm(p['name']) in pk or pk in norm(p['name']) for pk in poly_keys
        )
    ]
    plots.sort(key=sort_key)

    def ts_str(s):
        return json.dumps(s, ensure_ascii=False)

    lines = ["import type {PlotArea} from '../types';", '', 'export const plots: readonly PlotArea[] = [']
    for p in plots:
        polygon = ''
        if p['polygon']:
            coords = ', '.join(f'[{lat:.7f}, {lon:.7f}]' for lat, lon in p['polygon'])
            polygon = f'[{coords}]'
        minerals = ', '.join(ts_str(m) for m in p['minerals'])
        lines.append('  {')
        lines.append(f'    name: {ts_str(p["name"])},')
        lines.append(f'    region: {ts_str(p["region"])},')
        lines.append(f'    location: {ts_str(p["location"])},')
        lines.append(f'    areaKm2: {p["area"]},')
        lines.append(f'    minerals: [{minerals}],')
        lines.append(f'    polygon: {polygon if polygon else "null"},')
        lines.append('  },')
    lines.append('];')
    lines.append('')

    OUT_TS.parent.mkdir(parents=True, exist_ok=True)
    OUT_TS.write_text('\n'.join(lines), encoding='utf-8')
    with_poly = sum(1 for p in plots if p['polygon'])
    print(f'Участков: {len(plots)}, с полигонами: {with_poly}, без: {len(plots) - with_poly}')
    print(f'Записано: {OUT_TS}')
    orphan_xlsx = [xp['name'] for xp in xlsx_plots if xp['name'] not in used_xlsx]
    if orphan_xlsx:
        print('!! Не сопоставлены с сайтом:', orphan_xlsx)


if __name__ == '__main__':
    main()
