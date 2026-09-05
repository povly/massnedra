/**
 * Видимость панелей сайдбара. Три экрана:
 * 'regions' — области, 'list' — районы/точки, 'object' — детали участка.
 */

export type Panel = 'regions' | 'list' | 'object';

export interface PanelSwitcherElements {
  groups: HTMLElement;
  places: HTMLElement;
  object: HTMLElement;
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
      els.object.classList.toggle('active', panel === 'object');
      active = panel;
    },
  };
}
