#!/usr/bin/env python3
"""Собирает public/geo/regions.json — контуры нужных субъектов РФ
в формате Яндекс.Карт (MultiPolygon, [lat, lon]) из полного GeoJSON.

Запуск: python3 scripts/build-region-borders.py <исходный.geojson>
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / 'public' / 'geo' / 'regions.json'

NEEDED = [
    'Хабаровский край',
    'Магаданская область',
    'Иркутская область',
    'Приморский край',
    'Амурская область',
    'Республика Бурятия',
]

ROUND_DIGITS = 3
STEP_DENSE = 3
DENSE_THRESHOLD = 400


def round_ring(geojson_ring):
    """GeoJSON: [lon, lat] -> Яндекс.Карты: [lat, lon]."""
    return [
        [round(float(point[1]), ROUND_DIGITS), round(float(point[0]), ROUND_DIGITS)]
        for point in geojson_ring
    ]


def thin_ring(ring):
    if len(ring) <= DENSE_THRESHOLD:
        return ring
    step = STEP_DENSE * (len(ring) // DENSE_THRESHOLD + 1)
    thinned = ring[::step]
    if thinned[-1] != ring[-1]:
        thinned.append(ring[-1])
    return thinned


def main():
    if len(sys.argv) < 2:
        sys.exit('Использование: build-region-borders.py <russia.geojson>')
    data = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))

    out = {}
    for feature in data['features']:
        name = feature['properties'].get('name')
        if name not in NEEDED:
            continue
        geometry = feature['geometry']
        # GeoJSON: Polygon -> [ring][lon,lat]; MultiPolygon -> [poly][ring][lon,lat]
        polygons = (
            [geometry['coordinates']]
            if geometry['type'] == 'Polygon'
            else geometry['coordinates']
        )
        yandex_polygons = []
        for polygon in polygons:
            yandex_polygons.append([thin_ring(round_ring(ring)) for ring in polygon])
        out[name] = yandex_polygons

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(
        json.dumps(out, ensure_ascii=False, separators=(',', ':')),
        encoding='utf-8',
    )
    size_kb = OUT_JSON.stat().st_size // 1024
    print(f'Регионы: {len(out)} -> {OUT_JSON} ({size_kb} КБ)')


if __name__ == '__main__':
    main()
