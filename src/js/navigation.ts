/**
 * Навигация по уровням: области → районы → точки, с кнопкой «Назад».
 * Логика переходов отделена от DOM (DIP: работает через PanelSwitcher
 * и переданные коллбеки).
 */

export type Level = 'regions' | 'districts' | 'plots';

export interface NavigationCallbacks {
  /** Пере-рендер текущего уровня списка. */
  render(level: Level): void;
  /** Смена видимости панелей. */
  showPanel(panel: 'regions' | 'list'): void;
}

export interface Navigation {
  readonly level: Level;
  readonly region: string | null;
  readonly district: string | null;
  openDistricts(region: string): void;
  openPlots(district: string): void;
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
    callbacks.showPanel(level === 'regions' ? 'regions' : 'list');
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

    goBack(): void {
      if (level === 'plots') set('districts', region, null);
      else if (level === 'districts') set('regions', null, null);
    },
  };
}
