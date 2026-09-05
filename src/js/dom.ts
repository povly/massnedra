/**
 * Типизированный доступ к DOM-узлам блока «Инвестиционные проекты».
 * Единственное место, знающее селекторы разметки.
 */

export interface MapDomRefs {
  mapItem: HTMLElement;
  mapShow: HTMLElement;
  groups: HTMLElement;
  places: HTMLElement;
  placesTitle: HTMLElement;
  placesItems: HTMLElement;
}

const SELECTORS = {
  mapItem: '.p-map__item',
  mapShow: '.p-map__show',
  groups: '.p-map__groups',
  places: '.p-map__places',
  placesTitle: '.p-map__places-title',
  placesItems: '.p-map__places-items',
} as const;

function requireEl<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) {
    console.warn(`[p-map] элемент не найден: ${selector}`);
    throw new Error(`[p-map] элемент не найден: ${selector}`);
  }
  return el;
}

export function getDomRefs(): MapDomRefs {
  return {
    mapItem: requireEl(SELECTORS.mapItem),
    mapShow: requireEl(SELECTORS.mapShow),
    groups: requireEl(SELECTORS.groups),
    places: requireEl(SELECTORS.places),
    placesTitle: requireEl(SELECTORS.placesTitle),
    placesItems: requireEl(SELECTORS.placesItems),
  };
}
