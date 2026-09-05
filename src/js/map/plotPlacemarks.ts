import {plotPoint} from '../data/groupPlots';
import type {PlotArea, YmapsCoordinates, YmapsPlacemark} from '../types';

const PIN_URL =
  'https://static.tildacdn.com/tild3765-3531-4639-a336-633133363238/Map_Pin.png';

const PIN_SIZE: [number, number] = [34, 48];
const PIN_OFFSET: [number, number] = [-19, -48];

const ESCAPE_RULES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>]/g, (ch) => ESCAPE_RULES[ch] ?? ch);
}

function balloonHtml(plot: PlotArea): string {
  const minerals = plot.minerals.length > 0 ? escapeHtml(plot.minerals.join(', ')) : '—';
  return [
    `${escapeHtml(plot.location)}<br/><br/>`,
    `Площадь: <strong>${plot.areaKm2} км²</strong><br/>`,
    `Полезные ископаемые: ${minerals}`,
  ].join('');
}

/**
 * Точки участков на карте: клик — балун с описанием, площадью, ископаемыми.
 * Участки без контура (нет координат) на карту не попадают.
 */
export function createPlotPlacemarks(
  plots: readonly PlotArea[],
): YmapsPlacemark[] {
  const placemarks: YmapsPlacemark[] = [];
  for (const plot of plots) {
    const point = plotPoint(plot);
    if (!point) continue;
    const placemark = new ymaps.Placemark(
      point,
      {
        balloonContentHeader: escapeHtml(plot.name),
        balloonContentBody: balloonHtml(plot),
        hintContent: escapeHtml(plot.name),
      },
      {
        iconLayout: 'default#image',
        iconImageHref: PIN_URL,
        iconImageSize: PIN_SIZE,
        iconImageOffset: PIN_OFFSET,
      },
    );
    placemark.events.add('click', () => {
      mapFocusRef?.(point);
    });
    placemarks.push(placemark);
  }
  return placemarks;
}

let mapFocusRef: ((point: YmapsCoordinates) => void) | null = null;

/** Коллбек плавного центрирования карты при клике на точку (из main). */
export function setMapFocusHandler(handler: ((point: YmapsCoordinates) => void) | null): void {
  mapFocusRef = handler;
}
