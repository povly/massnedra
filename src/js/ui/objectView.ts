import type {PlotArea} from '../types';

export interface ObjectViewElements {
  objectTitle: HTMLElement;
  objectSubtitle: HTMLElement;
  objectText: HTMLElement;
}

/** Детали участка: название, регион+район, площадь, ископаемые. */
export function renderObject(els: ObjectViewElements, plot: PlotArea): void {
  els.objectTitle.textContent = plot.name;
  els.objectSubtitle.textContent = [plot.location, plot.region]
    .filter(Boolean)
    .join(', ');
  const minerals =
    plot.minerals.length > 0 ? plot.minerals.join(', ') : 'не указаны';
  els.objectText.textContent = `Площадь: ${plot.areaKm2} км². Полезные ископаемые: ${minerals}.`;
}
