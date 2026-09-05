import type {PlotArea, YmapsCoordinates} from '../types';

export interface PlotGroup {
  /** Ключ группировки: имя региона или района. */
  name: string;
  plots: PlotArea[];
}

/** «Охотский муниципальный округ» и «Охотский район» → один район. */
export function normalizeDistrict(location: string): string {
  const base = location
    .replace(/муниципальный округ/gi, '')
    .replace(/муниципальный район/gi, '')
    .replace(/городской округ/gi, '')
    .replace(/район/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  return base || location.trim();
}

export function districtDisplayName(districtKey: string): string {
  return `${districtKey} район`;
}

/** Точка участка на карте (запечена в данные при сборке). */
export function plotPoint(plot: PlotArea): YmapsCoordinates | null {
  return plot.point;
}

export function groupPlotsByRegion(plots: readonly PlotArea[]): PlotGroup[] {
  return groupBy(plots, (plot) => plot.region);
}

export function groupPlotsByDistrict(plots: readonly PlotArea[]): PlotGroup[] {
  return groupBy(plots, (plot) => normalizeDistrict(plot.location));
}

function groupBy(plots: readonly PlotArea[], keyOf: (plot: PlotArea) => string): PlotGroup[] {
  const map = new Map<string, PlotArea[]>();
  for (const plot of plots) {
    const key = keyOf(plot);
    const bucket = map.get(key);
    if (bucket) bucket.push(plot);
    else map.set(key, [plot]);
  }
  return [...map.entries()]
    .map(([name, groupPlots]) => ({name, plots: groupPlots}))
    .sort((a, b) => b.plots.length - a.plots.length || a.name.localeCompare(b.name));
}
