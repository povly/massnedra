import {plots} from './data/plots';
import {
  districtDisplayName,
  groupPlotsByDistrict,
  groupPlotsByRegion,
  plotPoint,
} from './data/groupPlots';
import {getDomRefs} from './dom';
import {createMap} from './map/createMap';
import {createPlotPlacemarks, setMapFocusHandler} from './map/plotPlacemarks';
import type {PlacemarkInput} from './map/plotPlacemarks';
import {createPlotPolygons} from './map/plotPolygons';
import {createNavigation} from './navigation';
import {initScrollables} from './vendor/scrollable';
import {renderList} from './ui/listView';
import {createPanelSwitcher} from './ui/panelSwitcher';
import {renderObject} from './ui/objectView';
import type {Level} from './navigation';
import type {PlotArea, YmapsCoordinates, YmapsMap, YmapsPlacemark} from './types';

window.addEventListener('DOMContentLoaded', () => {
  // Кастомный скроллбар для [data-scrollable]
  initScrollables(document);

  const refs = getDomRefs();

  // Показать/скрыть сайдбар на мобильных
  refs.mapShow.addEventListener('click', () => {
    refs.mapItem.classList.toggle('active');
  });

  const districtKey = (plot: PlotArea): string =>
    plot.location
      .replace(/муниципальный округ/gi, '')
      .replace(/муниципальный район/gi, '')
      .replace(/городской округ/gi, '')
      .replace(/район/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Состояние карты (наполняется после готовности API Яндекса)
  let map: YmapsMap | null = null;
  let plotPolygons: ReturnType<typeof createPlotPolygons> | null = null;
  let placemarks: Array<{
    plot: PlotArea;
    point: YmapsCoordinates;
    placemark: YmapsPlacemark;
  }> = [];

  let selectedPlot: PlotArea | null = null;

  const switcher = createPanelSwitcher({
    groups: refs.groups,
    places: refs.places,
    object: refs.object,
  });

  function setPlacemarksVisible(visiblePlots: readonly PlotArea[] | null): void {
    for (const {plot, placemark} of placemarks) {
      placemark.options.set(
        'visible',
        visiblePlots === null || visiblePlots.includes(plot),
      );
    }
  }

  // Границы по ФАКТИЧЕСКИМ точкам меток (включая приближённые)
  function boundsOf(visiblePlots: readonly PlotArea[]): [number, number][] | null {
    const points = placemarks
      .filter(({plot}) => visiblePlots.includes(plot))
      .map(({point}) => point);
    if (points.length === 0) return null;
    const lats = points.map(([lat]) => lat);
    const lons = points.map(([, lon]) => lon);
    return [
      [Math.min(...lats), Math.min(...lons)],
      [Math.max(...lats), Math.max(...lons)],
    ];
  }

  function fitTo(visiblePlots: readonly PlotArea[]): void {
    if (!map) return;
    const bounds = boundsOf(visiblePlots);
    if (bounds) map.setBounds(bounds, {checkZoomRange: true, zoomMargin: 40});
  }

  function focusPlot(plot: PlotArea): void {
    if (!map) return;
    const match = placemarks.find((item) => item.plot === plot);
    if (!match) {
      // У участка нет координат — показываем территорию области
      fitTo(plotsInScope('districts'));
      return;
    }
    map.setCenter(match.point, 9);
    match.placemark.balloon.open();
  }

  function plotsInScope(level: 'districts' | 'plots'): readonly PlotArea[] {
    if (level === 'districts') {
      return plots.filter((plot) => plot.region === navigation.region);
    }
    return plots.filter(
      (plot) =>
        plot.region === navigation.region &&
        districtKey(plot) === navigation.district,
    );
  }

  function selectPlot(plot: PlotArea): void {
    selectedPlot = plot;
    plotPolygons?.highlight(plot);
    renderObject(refs, plot);
    navigation.openObject();
    focusPlot(plot);
  }

  function render(level: Level): void {
    try {
      renderImpl(level);
    } catch (error) {
      console.warn('[p-map] ошибка отрисовки:', error);
    }
  }

  function renderImpl(level: Level): void {
    if (map?.balloon) map.balloon.close();

    if (level === 'regions') {
      refs.placesTitle.textContent = 'Инвестиционные проекты';
      setPlacemarksVisible(null);
      renderList(
        {container: refs.groups, variant: 'group'},
        groupPlotsByRegion(plots).map((group) => ({
          title: group.name,
          subtitle: String(group.plots.length),
        })),
        (index) => {
          const groups = groupPlotsByRegion(plots);
          navigation.openDistricts(groups[index].name);
        },
      );
      fitTo(plots);
      return;
    }

    if (level === 'districts') {
      const regionPlots = plotsInScope('districts');
      refs.placesTitle.textContent = navigation.region ?? '';
      setPlacemarksVisible(regionPlots);
      fitTo(regionPlots);
      renderList(
        {container: refs.placesItems, variant: 'place'},
        groupPlotsByDistrict(regionPlots).map((group) => ({
          title: districtDisplayName(group.name),
          subtitle: `Участков: ${group.plots.length}`,
        })),
        (index) => {
          const districts = groupPlotsByDistrict(regionPlots);
          navigation.openPlots(districts[index].name);
        },
      );
      return;
    }

    if (level === 'object') {
      if (selectedPlot) renderObject(refs, selectedPlot);
      return;
    }

    const districtPlots = plotsInScope('plots');
    refs.placesTitle.textContent = districtDisplayName(navigation.district ?? '');
    setPlacemarksVisible(districtPlots);
    fitTo(districtPlots);
    renderList(
      {container: refs.placesItems, variant: 'place'},
      districtPlots.map((plot) => ({
        title: plot.name,
        subtitle: `${plot.areaKm2} км² · ${plot.minerals.join(', ')}`,
      })),
      (index) => selectPlot(districtPlots[index]),
    );
  }

  const navigation = createNavigation({
    render,
    showPanel: (panel) => switcher.show(panel),
  });

  // Клик по точке на карте — выбираем участок (детали + балун)
  setMapFocusHandler((plot) => selectPlot(plot));

  // Кнопка «Назад»
  document.querySelectorAll('.p-map__back').forEach((backButton) => {
    backButton.addEventListener('click', () => {
      if (navigation.level === 'object') {
        selectedPlot = null;
        plotPolygons?.highlight(null);
      }
      navigation.goBack();
    });
  });

  // Список областей показываем СРАЗУ, не дожидаясь API Яндекса
  render('regions');
  switcher.show('regions');

  // Геокодирование центров районов — параллельно, один запрос на район
  const districtCenters = new Map<string, YmapsCoordinates | null>();

  async function resolveDistrictCenter(
    plot: PlotArea,
  ): Promise<YmapsCoordinates | null> {
    const key = `${plot.region}|${districtKey(plot)}`;
    if (districtCenters.has(key)) return districtCenters.get(key) ?? null;
    let center: YmapsCoordinates | null = null;
    try {
      const result = await ymaps.geocode(`${plot.region}, ${plot.location}`, {
        results: 1,
      });
      const first = result.geoObjects.get(0);
      center = first ? first.geometry.getCoordinates() : null;
    } catch (error) {
      console.warn(`[p-map] геокодирование не удалось: ${plot.location}`, error);
    }
    districtCenters.set(key, center);
    return center;
  }

  async function resolvePlacemarkInputs(): Promise<PlacemarkInput[]> {
    // Сначала параллельно геокодируем все недостающие районы
    const unmapped = plots.filter((plot) => !plotPoint(plot));
    const districtIds = [
      ...new Set(unmapped.map((plot) => `${plot.region}|${districtKey(plot)}`)),
    ];
    await Promise.all(
      districtIds.map(async (key) => {
        const [region, district] = key.split('|');
        const sample = unmapped.find(
          (plot) => plot.region === region && districtKey(plot) === district,
        );
        if (sample) await resolveDistrictCenter(sample);
      }),
    );

    // Затем расставляем все метки
    const inputs: PlacemarkInput[] = [];
    const approximateOrder = new Map<string, number>();
    for (const plot of plots) {
      const exact = plotPoint(plot);
      if (exact) {
        inputs.push({plot, point: exact, approximated: false});
        continue;
      }
      const center = await resolveDistrictCenter(plot);
      if (!center) continue;
      const districtId = `${plot.region}|${districtKey(plot)}`;
      const order = approximateOrder.get(districtId) ?? 0;
      approximateOrder.set(districtId, order + 1);
      // Разводим участки одного района по кругу, чтобы не слипались
      const angle = (order * Math.PI * 2) / 8;
      inputs.push({
        plot,
        point: [
          center[0] + 0.06 * Math.cos(angle),
          center[1] + 0.09 * Math.sin(angle),
        ],
        approximated: true,
      });
    }
    return inputs;
  }

  // Карта и всё зависимое от API Яндекса
  ymaps.ready(() => {
    map = createMap();
    refs.mapIframe.classList.add('is-ready');

    plotPolygons = createPlotPolygons();
    plotPolygons.create(plots, map);

    resolvePlacemarkInputs()
      .then((inputs) => {
        placemarks = createPlotPlacemarks(inputs);
        for (const {placemark} of placemarks) map?.geoObjects.add(placemark);
        // Пересинхронизация текущего уровня: видимость меток + рамка
        render(navigation.level);
      })
      .catch((error) => {
        console.warn('[p-map] инициализация меток не удалась:', error);
      });
  });
});
