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
import {createRegionBorders} from './map/regionBorders';
import {createNavigation} from './navigation';
import {initScrollables} from './vendor/scrollable';
import {renderList} from './ui/listView';
import {createPanelSwitcher} from './ui/panelSwitcher';
import type {Level} from './navigation';
import type {PlotArea, YmapsCoordinates} from './types';

window.addEventListener('load', () => {
  // Кастомный скроллбар для [data-scrollable]
  initScrollables(document);

  const refs = getDomRefs();

  // Показать/скрыть сайдбар на мобильных
  refs.mapShow.addEventListener('click', () => {
    refs.mapItem.classList.toggle('active');
  });

  ymaps.ready(() => {
    const map = createMap();
    const regionBorders = createRegionBorders();
    const placemarks = createPlotPlacemarks(plots);
    placemarks.forEach((placemark) => map.geoObjects.add(placemark));

    const regionNames = [...new Set(plots.map((plot) => plot.region))];
    regionBorders
      .load(regionNames, map)
      .catch((error) => {
        console.warn('[p-map] не удалось загрузить границы областей:', error);
      })
      .then(() => {
        fitTo(plots);
      });

    const switcher = createPanelSwitcher({groups: refs.groups, places: refs.places});

    const districtKey = (plot: PlotArea): string =>
      plot.location
        .replace(/муниципальный округ/gi, '')
        .replace(/муниципальный район/gi, '')
        .replace(/городской округ/gi, '')
        .replace(/район/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    const plotsWithPoint = plots.filter((plot) => plotPoint(plot) !== null);

    function setPlacemarksVisible(visiblePlots: readonly PlotArea[] | null): void {
      placemarks.forEach((placemark, index) => {
        const plot = plotsWithPoint[index];
        placemark.options.set(
          'visible',
          visiblePlots === null || visiblePlots.includes(plot),
        );
      });
    }

    function boundsOf(visiblePlots: readonly PlotArea[]): [number, number][] | null {
      const points = visiblePlots
        .map((plot) => plotPoint(plot))
        .filter((point): point is YmapsCoordinates => point !== null);
      if (points.length === 0) return null;
      const lats = points.map(([lat]) => lat);
      const lons = points.map(([, lon]) => lon);
      return [
        [Math.min(...lats), Math.min(...lons)],
        [Math.max(...lats), Math.max(...lons)],
      ];
    }

    function fitTo(visiblePlots: readonly PlotArea[]): void {
      const bounds = boundsOf(visiblePlots);
      if (bounds) map.setBounds(bounds, {checkZoomRange: true, zoomMargin: 40});
    }

    function focusPlot(plot: PlotArea): void {
      const point = plotPoint(plot);
      if (!point) return;
      map.setCenter(point, 11);
      const placemark = placemarks[plotsWithPoint.indexOf(plot)];
      if (placemark) placemark.balloon.open();
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

    function render(level: Level): void {
      try {
        renderImpl(level);
      } catch (error) {
        console.warn('[p-map] ошибка отрисовки списка:', error);
      }
    }

    function renderImpl(level: Level): void {
      if (map.balloon) map.balloon.close();

      if (level === 'regions') {
        refs.placesTitle.textContent = 'Инвестиционные проекты';
        regionBorders.highlight(null);
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
        regionBorders.highlight(navigation.region);
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
        (index) => {
          const plot = districtPlots[index];
          if (plotPoint(plot)) {
            focusPlot(plot);
          } else {
            // Нет координат — показываем территорию области
            fitTo(plotsInScope('districts'));
          }
        },
      );
    }

    const navigation = createNavigation({
      render,
      showPanel: (panel) => switcher.show(panel),
    });

    // Клик по точке на карте — балун открывает Яндекс, плавно центрируем
    setMapFocusHandler((point) => map.setCenter(point, 11));

    // Кнопка «Назад»
    document.querySelectorAll('.p-map__back').forEach((backButton) => {
      backButton.addEventListener('click', () => navigation.goBack());
    });

    // Стартовый экран — список областей
    render('regions');
    switcher.show('regions');
  });
});
