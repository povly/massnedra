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
  const minerals =
    plot.minerals.length > 0 ? escapeHtml(plot.minerals.join(', ')) : '—';
  return [
    `${escapeHtml(plot.location)}<br/><br/>`,
    `Площадь: <strong>${plot.areaKm2} км²</strong><br/>`,
    `Полезные ископаемые: ${minerals}`,
  ].join('');
}

/**
 * Метки ВСЕХ участков: точка = центроид территории (запечён в данные).
 * Клик по метке — выбор участка через onSelect.
 */
export function createPlotPlacemarks(
  plots: readonly PlotArea[],
  onSelect: (plot: PlotArea) => void,
): Array<{plot: PlotArea; point: YmapsCoordinates; placemark: YmapsPlacemark}> {
  const result: Array<{
    plot: PlotArea;
    point: YmapsCoordinates;
    placemark: YmapsPlacemark;
  }> = [];
  for (const plot of plots) {
    if (!plot.point) continue;
    const placemark = new ymaps.Placemark(
      plot.point,
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
    placemark.events.add('click', () => onSelect(plot));
    result.push({plot, point: plot.point, placemark});
  }
  return result;
}