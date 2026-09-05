/**
 * Типизированный доступ к DOM-узлам блока «Инвестиционные проекты».
 * Единственное место, знающее селекторы разметки.
 */

export interface MapDomRefs {
  mapItem: HTMLElement;
  mapIframe: HTMLElement;
  mapShow: HTMLElement;
  groups: HTMLElement;
  places: HTMLElement;
  object: HTMLElement;
  placesTitle: HTMLElement;
  placesItems: HTMLElement;
  objectTitle: HTMLElement;
  objectSubtitle: HTMLElement;
  objectText: HTMLElement;
}

const SELECTORS = {
  mapItem: '.p-map__item',
  mapIframe: '#p-map__iframe',
  mapShow: '.p-map__show',
  groups: '.p-map__groups',
  places: '.p-map__places',
  object: '.p-map__object',
  placesTitle: '.p-map__places-title',
  placesItems: '.p-map__places-items',
  objectTitle: '.p-map__object-title',
  objectSubtitle: '.p-map__object-subtitle',
  objectText: '.p-map__object-text',
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
    mapIframe: requireEl(SELECTORS.mapIframe),
    mapShow: requireEl(SELECTORS.mapShow),
    groups: requireEl(SELECTORS.groups),
    places: requireEl(SELECTORS.places),
    object: requireEl(SELECTORS.object),
    placesTitle: requireEl(SELECTORS.placesTitle),
    placesItems: requireEl(SELECTORS.placesItems),
    objectTitle: requireEl(SELECTORS.objectTitle),
    objectSubtitle: requireEl(SELECTORS.objectSubtitle),
    objectText: requireEl(SELECTORS.objectText),
  };
}
