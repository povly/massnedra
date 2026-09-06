#!/usr/bin/env python3
"""Собирает src/js/data/plots.ts из xlsx датасета МАН (один источник).

Колонки xlsx: Участок / Регион / Расположение / Площадь, км.кв. /
Полезные ископаемые / Координаты (ГСК-2011, DMS построчно — вершины полигона).

Точка участка — центроид полигона (метка в центре территории).
Участки без полигона (< 3 вершин) пропускаются с предупреждением.

Запуск:
    uv run --with openpyxl python3 scripts/build-plots-data.py \
        scripts/source/Объекты_для_размещения_на_сайте_МАН.xlsx
"""
import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
OUT_TS = ROOT / 'src' / 'js' / 'data' / 'plots.ts'


def dms_to_decimal(line: str):
    """'53\\t30\\t41.4430\\t099\\t20\\t26.0250' -> (lat, lon) в десятичных градусах."""
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
    skipped = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        name, region, location, area, minerals, coords = row
        if not name:
            continue
        polygon = []
        for line in str(coords or '').split('\n'):
            point = dms_to_decimal(line.strip())
            if point:
                polygon.append(point)
        if len(polygon) < 3:
            skipped.append(str(name).strip())
            continue
        minerals_list = [
            m.strip() for m in re.split(r'[,;]', str(minerals or '')) if m.strip()
        ]
        n = len(polygon)
        centroid = (
            round(sum(p[0] for p in polygon) / n, 7),
            round(sum(p[1] for p in polygon) / n, 7),
        )
        plots.append({
            'name': str(name).strip(),
            'region': str(region).strip(),
            'location': str(location or '').strip(),
            'area': float(str(area).replace(',', '.')) if area else None,
            'minerals': minerals_list,
            'polygon': polygon,
            'point': centroid,
        })
    return plots, skipped


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
        sys.exit(
            'Использование: build-plots-data.py '
            'scripts/source/Объекты_для_размещения_на_сайте_МАН.xlsx'
        )
    plots, skipped = parse_xlsx(resolve_xlsx(sys.argv[1]))
    plots.sort(key=lambda p: (p['region'], p['name']))

    def ts_str(s):
        return json.dumps(s, ensure_ascii=False)

    lines = ["import type {PlotArea} from '../types';", '', 'export const plots: readonly PlotArea[] = [']
    for p in plots:
        coords = ', '.join(f'[{lat:.7f}, {lon:.7f}]' for lat, lon in p['polygon'])
        polygon = f'[{coords}]'
        minerals = ', '.join(ts_str(m) for m in p['minerals'])
        lines.append('  {')
        lines.append(f'    name: {ts_str(p["name"])},')
        lines.append(f'    region: {ts_str(p["region"])},')
        lines.append(f'    location: {ts_str(p["location"])},')
        lines.append(f'    areaKm2: {p["area"]},')
        lines.append(f'    minerals: [{minerals}],')
        lines.append(f'    polygon: {polygon},')
        lines.append(
            f'    point: [{p["point"][0]:.7f}, {p["point"][1]:.7f}],'
        )
        lines.append('  },')
    lines.append('];')
    lines.append('')

    OUT_TS.parent.mkdir(parents=True, exist_ok=True)
    OUT_TS.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Участков: {len(plots)}, все с полигонами')
    print(f'Записано: {OUT_TS}')
    if skipped:
        print('!! Пропущены (полигон < 3 вершин):', skipped)


if __name__ == '__main__':
    main()
