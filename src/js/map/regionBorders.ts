import type {YmapsMap, YmapsPolygon} from '../types';

const REGION_FILL = 'rgba(69, 100, 255, 0.18)';
const REGION_STROKE = '#4564FF';
const REGION_STROKE_SELECTED = '#f93a3a';

export interface RegionBorders {
  /** Загружает контуры субъектов РФ из public/geo и рисует нужные области. */
  load(regions: readonly string[], map: YmapsMap): Promise<void>;
  /** Подсветка выбранной области (остальные — приглушённые). */
  highlight(region: string | null): void;
}

/**
 * Контуры областей из public/geo/regions.json (script build-region-borders.py):
 * полупрозрачная заливка территории + видимая обводка по границе.
 */
export function createRegionBorders(): RegionBorders {
  const drawn = new Map<string, YmapsPolygon[]>();

  return {
    async load(regions, map): Promise<void> {
      const response = await fetch('/geo/regions.json');
      if (!response.ok) {
        throw new Error(`geo/regions.json недоступен: ${response.status}`);
      }
      const data = (await response.json()) as Record<string, number[][][][]>;
      for (const [name, polygons] of Object.entries(data)) {
        if (!regions.includes(name)) continue;
        const parts: YmapsPolygon[] = [];
        for (const rings of polygons) {
          const polygon = new ymaps.Polygon(
            rings,
            {},
            {
              fillColor: REGION_FILL,
              strokeColor: REGION_STROKE,
              strokeWidth: 3,
            },
          );
          map.geoObjects.add(polygon);
          parts.push(polygon);
        }
        drawn.set(name, parts);
      }
    },

    highlight(region): void {
      for (const [name, parts] of drawn) {
        const selected = region !== null && name === region;
        const strokeColor = selected ? REGION_STROKE_SELECTED : REGION_STROKE;
        const fillColor = selected ? 'rgba(249, 58, 58, 0.10)' : REGION_FILL;
        for (const part of parts) {
          part.options.set('strokeColor', strokeColor);
          part.options.set('strokeWidth', selected ? 4 : 2.5);
          part.options.set('fillColor', fillColor);
        }
      }
    },
  };
}
