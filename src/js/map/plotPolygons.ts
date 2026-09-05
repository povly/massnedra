import type {PlotArea, YmapsMap, YmapsPolygon} from '../types';

const PLOT_STROKE = '#f93a3a';
const PLOT_FILL = 'rgba(249, 58, 58, 0.08)';
const PLOT_STROKE_SELECTED = '#f93a3a';
const PLOT_FILL_SELECTED = 'rgba(249, 58, 58, 0.28)';

export interface PlotPolygons {
  /** Рисует контуры всех участков, у которых есть координаты границ. */
  create(plots: readonly PlotArea[], map: YmapsMap): void;
  /** Подсвечивает контур выбранного участка. */
  highlight(plot: PlotArea | null): void;
}

/**
 * Контуры участков из файла (ГСК-2011 → WGS-84): «фигура» территории
 * с обводкой по границе. Выбирается наряду с точкой.
 */
export function createPlotPolygons(): PlotPolygons {
  const byPlot = new Map<PlotArea, YmapsPolygon[]>();

  return {
    create(plots, map): void {
      for (const plot of plots) {
        if (!plot.polygon || plot.polygon.length < 3) continue;
        const parts: YmapsPolygon[] = [];
        // polygon: список колец (1 внешнее + возможные вырезы)
        const polygon = new ymaps.Polygon(
          [plot.polygon],
          {},
          {
            fillColor: PLOT_FILL,
            strokeColor: PLOT_STROKE,
            strokeWidth: 2,
          },
        );
        map.geoObjects.add(polygon);
        parts.push(polygon);
        byPlot.set(plot, parts);
      }
    },

    highlight(plot): void {
      for (const [owner, parts] of byPlot) {
        const selected = owner === plot;
        for (const part of parts) {
          part.options.set('strokeColor', PLOT_STROKE_SELECTED);
          part.options.set('strokeWidth', selected ? 4 : 2);
          part.options.set('fillColor', selected ? PLOT_FILL_SELECTED : PLOT_FILL);
        }
      }
    },
  };
}
