import type {PlotArea, YmapsCoordinates, YmapsPlacemark} from '../types';

const PIN_URL =
  'https://static.tildacdn.com/tild3765-3531-4639-a336-633133363238/Map_Pin.png';

const PIN_SIZE: [number, number] = [34, 48];
const PIN_OFFSET: [number, number] = [-19, -48];

const APPROXIMATE_NOTE =
  '<br/><small>Точка показывает центр района — координаты участка уточняются</small>';

export interface PlacemarkInput {
  plot: PlotArea;
  point: YmapsCoordinates;
  /** true — точка приближённая (центр района), а не контур участка. */
  approximated: boolean;
}

const ESCAPE_RULES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>]/g, (ch) => ESCAPE_RULES[ch] ?? ch);
}

function balloonHtml(plot: PlotArea, approximated: boolean): string {
  const minerals =
    plot.minerals.length > 0 ? escapeHtml(plot.minerals.join(', ')) : '—';
  return [
    `${escapeHtml(plot.location)}<br/><br/>`,
    `Площадь: <strong>${plot.areaKm2} км²</strong><br/>`,
    `Полезные ископаемые: ${minerals}`,
    approximated ? APPROXIMATE_NOTE : '',
  ].join('');
}

/** Метки ВСЕХ участков: клик — выбор участка (панель деталей + балун). */
export function createPlotPlacemarks(
  items: readonly PlacemarkInput[],
): Array<{plot: PlotArea; point: YmapsCoordinates; placemark: YmapsPlacemark}> {
  return items.map(({plot, point, approximated}) => {
    const placemark = new ymaps.Placemark(
      point,
      {
        balloonContentHeader: escapeHtml(plot.name),
        balloonContentBody: balloonHtml(plot, approximated),
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
      mapFocusRef?.(plot);
    });
    return {plot, point, placemark};
  });
}

let mapFocusRef: ((plot: PlotArea) => void) | null = null;

/** Коллбек выбора участка при клике на метку (из main). */
export function setMapFocusHandler(
  handler: ((plot: PlotArea) => void) | null,
): void {
  mapFocusRef = handler;
}
