export type Level = 'regions' | 'districts' | 'plots' | 'object';

export interface NavigationCallbacks {
  /** Пере-рендер текущего уровня списка/деталей. */
  render(level: Level): void;
  /** Смена видимости панелей. */
  showPanel(panel: 'regions' | 'list' | 'object'): void;
}

export interface Navigation {
  readonly level: Level;
  readonly region: string | null;
  readonly district: string | null;
  openDistricts(region: string): void;
  openPlots(district: string): void;
  openObject(): void;
  goBack(): void;
}

export function createNavigation(callbacks: NavigationCallbacks): Navigation {
  let level: Level = 'regions';
  let region: string | null = null;
  let district: string | null = null;

  function set(next: Level, nextRegion: string | null, nextDistrict: string | null): void {
    level = next;
    region = nextRegion;
    district = nextDistrict;
    callbacks.render(level);
    callbacks.showPanel(
      level === 'regions' ? 'regions' : level === 'object' ? 'object' : 'list',
    );
  }

  return {
    get level(): Level {
      return level;
    },
    get region(): string | null {
      return region;
    },
    get district(): string | null {
      return district;
    },

    openDistricts(nextRegion: string): void {
      set('districts', nextRegion, null);
    },

    openPlots(nextDistrict: string): void {
      set('plots', region, nextDistrict);
    },

    // Детали участка — состояние района/региона не меняется
    openObject(): void {
      level = 'object';
      callbacks.render(level);
      callbacks.showPanel('object');
    },

    goBack(): void {
      if (level === 'object') set('plots', region, district);
      else if (level === 'plots') set('districts', region, null);
      else if (level === 'districts') set('regions', null, null);
    },
  };
}
