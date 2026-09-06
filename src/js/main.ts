import {plots} from './data/plots';
import {
  districtDisplayName,
  groupPlotsByDistrict,
  groupPlotsByRegion,
} from './data/groupPlots';
import {getDomRefs} from './dom';
import {createMap} from './map/createMap';
import {createPlotPlacemarks} from './map/plotPlacemarks';
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

  // Границы по фактическим точкам меток. Минимальный охват рамки в градусах —
  // иначе один-два участка дают чрезмерный зум
  const MIN_VIEW_SPAN = 4;

  function boundsOf(visiblePlots: readonly PlotArea[]): [number, number][] | null {
    const points = placemarks
      .filter(({plot}) => visiblePlots.includes(plot))
      .map(({point}) => point);
    if (points.length === 0) return null;
    const lats = points.map(([lat]) => lat);
    const lons = points.map(([, lon]) => lon);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let minLon = Math.min(...lons);
    let maxLon = Math.max(...lons);
    if (maxLat - minLat < MIN_VIEW_SPAN) {
      const mid = (minLat + maxLat) / 2;
      minLat = mid - MIN_VIEW_SPAN / 2;
      maxLat = mid + MIN_VIEW_SPAN / 2;
    }
    if (maxLon - minLon < MIN_VIEW_SPAN) {
      const mid = (minLon + maxLon) / 2;
      minLon = mid - MIN_VIEW_SPAN / 2;
      maxLon = mid + MIN_VIEW_SPAN / 2;
    }
    return [
      [minLat, minLon],
      [maxLat, maxLon],
    ];
  }

  function fitTo(visiblePlots: readonly PlotArea[]): void {
    if (!map) return;
    const bounds = boundsOf(visiblePlots);
    if (bounds) map.setBounds(bounds, {checkZoomRange: true, zoomMargin: 40});
  }

  // Уровень района: приближенно, но не слишком — фиксированный зум вместо
  // setBounds (рамка в градусах на большом вьюпорте даёт слишком далёкий зум)
  const DISTRICT_ZOOM = 9;

  function focusDistrict(visiblePlots: readonly PlotArea[]): void {
    if (!map || visiblePlots.length === 0) return;
    const lats = visiblePlots
      .map((plot) => plot.point?.[0])
      .filter((v): v is number => v != null);
    const lons = visiblePlots
      .map((plot) => plot.point?.[1])
      .filter((v): v is number => v != null);
    if (lats.length === 0) return;
    map.setCenter(
      [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lons) + Math.max(...lons)) / 2],
      DISTRICT_ZOOM,
    );
  }

  function focusPlot(plot: PlotArea): void {
    if (!map) return;
    const match = placemarks.find((item) => item.plot === plot);
    if (!match) return;
    map.setCenter(match.point, 10);
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
    navigation.openObject(plot.name);
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
      // Восстанавливаем участок из истории: «назад» может вернуть к другой карточке
      const resolved =
        plots.find((plot) => plot.name === navigation.plotName) ?? selectedPlot;
      if (resolved) {
        selectedPlot = resolved;
        plotPolygons?.highlight(resolved);
        renderObject(refs, resolved);
      }
      return;
    }

    const districtPlots = plotsInScope('plots');
    refs.placesTitle.textContent = districtDisplayName(navigation.district ?? '');
    setPlacemarksVisible(districtPlots);
    focusDistrict(districtPlots);
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

  // Клик по полигону или метке — выбираем участок (детали + балун)
  // Кнопка «Назад»
  document.querySelectorAll('.p-map__back').forEach((backButton) => {
    backButton.addEventListener('click', () => {
      navigation.goBack();
      // Подсветку снимаем только при уходе из деталей; при возврате к другой
      // карточке renderImpl('object') сам восстановит selectedPlot и подсветку
      if (navigation.level !== 'object') {
        selectedPlot = null;
        plotPolygons?.highlight(null);
      }
    });
  });

  // Список областей показываем СРАЗУ, не дожидаясь API Яндекса
  render('regions');
  switcher.show('regions');

  // Карта и всё зависимое от API Яндекса
  ymaps.ready(() => {
    map = createMap();
    refs.mapIframe.classList.add('is-ready');

    plotPolygons = createPlotPolygons();
    plotPolygons.create(plots, map, selectPlot);

    // Метки всех участков — точки (центроиды территорий) запечены в данных
    placemarks = createPlotPlacemarks(plots, selectPlot);
    for (const {placemark} of placemarks) map?.geoObjects.add(placemark);
    render(navigation.level);
  });
});
