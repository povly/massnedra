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
  /** Имя участка для уровня 'object' — история помнит, какая карточка открыта. */
  plotName: string | null;
}

export interface Navigation {
  readonly level: Level;
  readonly region: string | null;
  readonly district: string | null;
  /** Имя открытого участка (актуально на уровне 'object'). */
  readonly plotName: string | null;
  openDistricts(region: string): void;
  openPlots(district: string): void;
  /** Детали участка; предыдущий экран запоминается в истории. */
  openObject(plotName: string): void;
  goBack(): void;
}

function sameState(a: NavState, b: NavState): boolean {
  return (
    a.level === b.level &&
    a.region === b.region &&
    a.district === b.district &&
    a.plotName === b.plotName
  );
}

export function createNavigation(callbacks: NavigationCallbacks): Navigation {
  let current: NavState = {
    level: 'regions',
    region: null,
    district: null,
    plotName: null,
  };
  // Полная история переходов: «Назад» проходит её шаг за шагом
  const history: NavState[] = [];

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

  /** Forward-переход: текущий экран уходит в историю (дубли подряд не пишем). */
  function transition(next: NavState): void {
    if (sameState(current, next)) return;
    history.push({...current});
    apply(next);
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
    get plotName(): string | null {
      return current.plotName;
    },

    openDistricts(region: string): void {
      transition({level: 'districts', region, district: null, plotName: null});
    },

    openPlots(district: string): void {
      transition({
        level: 'plots',
        region: current.region,
        district,
        plotName: null,
      });
    },

    openObject(plotName: string): void {
      // Повторный выбор точки не пишет историю — карточка перезаписывается,
      // «Назад» после любых точек ведёт на тот же список, откуда пришли
      if (current.level === 'object') {
        apply({...current, plotName});
        return;
      }
      transition({
        level: 'object',
        region: current.region,
        district: current.district,
        plotName,
      });
    },

    goBack(): void {
      const previous = history.pop();
      if (previous) apply(previous);
    },
  };
}
