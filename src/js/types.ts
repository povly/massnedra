/** Участок недр (инвестиционный проект). */
export interface PlotArea {
  /** Отображаемое имя карточки, напр. «№32. Турка». */
  name: string;
  /** Субъект РФ, напр. «Хабаровский край». */
  region: string;
  /** Район/округ расположения, напр. «Охотский район». */
  location: string;
  /** Площадь участка, км². */
  areaKm2: number;
  /** Полезные ископаемые. */
  minerals: string[];
  /** Точка участка на карте (центроид контура или центр района). */
  point: YmapsCoordinates | null;
  /** Контур участка (ГСК-2011 → WGS-84, [lat, lon]); null — контур не задан. */
  polygon: YmapsCoordinates[] | null;
}

/** Конфиг кастомного скроллбара (x-scrollable). */
export interface ScrollableOptions {
  orientation: 'vertical' | 'horizontal';
  thumbColor: string;
  thumbWidth: number;
  thumbRadius: number;
  trackOffset: number;
  minThumbSize: number;
  autoHide: boolean;
  fadeDelay: number;
}

/* ==========================================================================
   Минимальные типы API Яндекс.Карт (2.1) — только используемая поверхность.
   Глобальный `ymaps` приходит из <script src="https://api-maps.yandex.ru/...">.
   ========================================================================== */

export type YmapsCoordinates = [number, number];

export interface YmapsGeoObjectOptions {
  options: {
    set(
      name: 'fillColor' | 'strokeColor' | 'strokeWidth' | 'visible',
      value: string | number | boolean,
    ): void;
  };
}

export interface YmapsPlacemark extends YmapsGeoObjectOptions {
  geometry: {
    getCoordinates(): YmapsCoordinates;
  };
  events: {
    add(type: 'click', handler: (event: YmapsEvent) => void): void;
  };
  balloon: {
    open(): void;
    close(): void;
  };
}

export interface YmapsPolygon extends YmapsGeoObjectOptions {}

export interface YmapsEvent {
  get(name: 'target'): YmapsPlacemark;
}

export interface YmapsPlacemarkOptions {
  iconLayout: string;
  iconImageHref: string;
  iconImageSize: [number, number];
  iconImageOffset: [number, number];
}

export interface YmapsMap {
  controls: {
    add(control: YmapsControl): void;
  };
  geoObjects: {
    add(object: YmapsPlacemark | YmapsPolygon): void;
  };
  setBounds(
    bounds: YmapsCoordinates[],
    options?: {checkZoomRange?: boolean; zoomMargin?: number},
  ): void;
  setCenter(center: YmapsCoordinates, zoom?: number): void;
  balloon: {
    close(): void;
  };
}

export interface YmapsControl {
  brand: 'YmapsControl';
}

export interface YmapsApi {
  ready(callback: () => void): void;
  modules: {
    require(
      modules: string[],
      onSuccess: () => void,
      onError?: (error: unknown) => void,
    ): void;
  };
  Map: new (
    container: string | HTMLElement,
    state: {center: YmapsCoordinates; zoom: number; controls: string[]},
  ) => YmapsMap;
  Placemark: new (
    coordinates: YmapsCoordinates,
    properties: Record<string, unknown> | null,
    options: YmapsPlacemarkOptions,
  ) => YmapsPlacemark;
  control: {
    ZoomControl: new (options: Record<string, unknown>) => YmapsControl;
  };
  Polygon: new (
    coordinates: number[][][],
    properties: Record<string, unknown> | null,
    options: Record<string, unknown>,
  ) => YmapsPolygon;
  geocode: {
    /**
     * Геокодирование адреса/топонима. Результат — коллекция
     * geoObjects (get(index).geometry.getCoordinates()).
     */
    (
      request: string,
      options?: {results?: number},
    ): Promise<{geoObjects: {get(index: number): YmapsPlacemark | null}}>;
  };
}

declare global {
  // globalThis.ymaps — инжектится внешним скриптом Яндекс.Карт
  var ymaps: YmapsApi;
}

export {};
