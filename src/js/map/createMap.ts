import type {YmapsMap} from '../types';

const MAP_CONTAINER_ID = 'p-map__iframe';
const DEFAULT_MAP_CENTER: [number, number] = [55, 135];
const DEFAULT_MAP_ZOOM = 4;

/** Создаёт карту региона с элементом управления зумом. */
export function createMap(): YmapsMap {
  const map = new ymaps.Map(MAP_CONTAINER_ID, {
    center: DEFAULT_MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
    controls: [],
  });

  map.controls.add(
    new ymaps.control.ZoomControl({
      options: {position: {right: 50, top: 180}},
    }),
  );

  return map;
}
