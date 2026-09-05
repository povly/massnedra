export type Level = 'regions' | 'districts' | 'plots' | 'object';

export interface NavigationCallbacks {
  /** Пере-рендер текущего уровня списка/деталей. */
  render(level: Level): void;
  /** Смена видимости панелей. */
  showPanel(panel: 'regions' | 'list' | 'object'): void;
}

interface NavState {
  level: Level;
  region: string | null;
  district: string | null;
}

export interface Navigation {
  readonly level: Level;
  readonly region: string | null;
  readonly district: string | null;
  openDistricts(region: string): void;
  openPlots(district: string): void;
  /** Детали участка с запоминанием уровня возврата (карта/список). */
  openObject(): void;
  goBack(): void;
}

export function createNavigation(callbacks: NavigationCallbacks): Navigation {
  let current: NavState = {level: 'regions', region: null, district: null};
  // Куда вернуться по «Назад» из деталей (список, карта или Drill-down)
  let returnState: NavState | null = null;

  function apply(state: NavState): void {
    current = state;
    callbacks.render(state.level);
    callbacks.showPanel(
      state.level === 'regions'
        ? 'regions'
        : state.level === 'object'
          ? 'object'
          : 'list',
    );
  }

  return {
    get level(): Level {
      return current.level;
    },
    get region(): string | null {
      return current.region;
    },
    get district(): string | null {
      return current.district;
    },

    openDistricts(region: string): void {
      apply({level: 'districts', region, district: null});
    },

    openPlots(district: string): void {
      apply({level: 'plots', region: current.region, district});
    },

    openObject(): void {
      returnState = {...current};
      apply({level: 'object', region: current.region, district: current.district});
    },

    goBack(): void {
      if (current.level === 'object') {
        apply(returnState ?? {level: 'regions', region: null, district: null});
        returnState = null;
        return;
      }
      if (current.level === 'plots') {
        apply({level: 'districts', region: current.region, district: null});
        return;
      }
      if (current.level === 'districts') {
        apply({level: 'regions', region: null, district: null});
      }
    },
  };
}
