/**
 * Видимость панелей сайдбара. Два экрана:
 * 'regions' — список областей, 'list' — районы/точки выбранной области.
 */

export type Panel = 'regions' | 'list';

export interface PanelSwitcherElements {
  groups: HTMLElement;
  places: HTMLElement;
}

export interface PanelSwitcher {
  readonly active: Panel;
  show(panel: Panel): void;
}

export function createPanelSwitcher(els: PanelSwitcherElements): PanelSwitcher {
  let active: Panel = 'regions';

  return {
    get active(): Panel {
      return active;
    },
    show(panel: Panel): void {
      els.groups.classList.toggle('active', panel === 'regions');
      els.places.classList.toggle('active', panel === 'list');
      active = panel;
    },
  };
}
