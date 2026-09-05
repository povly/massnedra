import type {ScrollableOptions} from '../types';

/**
 * Кастомный скроллбар-оверлей — порт плагина x-scrollable
 * (resources/js/alpine/plugins/scrollable.js) без зависимости от Alpine.js.
 *
 * Заменяет нативный скроллбар на кастомный оверлей, одинаковый во всех
 * браузерах (Firefox не умеет border-radius на thumb, ширины ограничены).
 *
 * Использование:
 *   <div data-scrollable>...</div>                        — дефолтный конфиг
 *   <div data-scrollable='{"thumbWidth": 6}'>...</div>    — JSON-переопределения
 *
 * Элемент обязан иметь `overflow-y: auto` (или scroll) и размеры через CSS —
 * директива не навязывает геометрию, только визуал скроллбара.
 *
 * Трансформация DOM:
 *   <div data-scrollable>...</div>
 *   становится:
 *   <div class="x-scrollable__wrapper">
 *     <div class="x-scrollable">...</div>
 *     <div class="x-scrollable__track"><div class="x-scrollable__thumb"></div></div>
 *   </div>
 */

const DEFAULTS: ScrollableOptions = {
  orientation: 'vertical',
  thumbColor: '#bfbfbf',
  thumbWidth: 4,
  thumbRadius: 4,
  trackOffset: 2,
  minThumbSize: 24,
  autoHide: false,
  fadeDelay: 800,
};

function readDataConfig(el: HTMLElement): Partial<ScrollableOptions> {
  const raw = el.getAttribute('data-scrollable');
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Partial<ScrollableOptions>;
    }
  } catch (error) {
    console.warn(`[scrollable] некорректный JSON в data-scrollable: ${String(error)}`);
  }
  return {};
}

interface ScrollMetrics {
  clientSize: number;
  scrollSize: number;
  scrollPos: number;
  thumbSize: number;
  maxThumbPos: number;
  maxScroll: number;
}

/**
 * Инициализирует кастомный скроллбар на элементе.
 * @returns disposer — полностью снимает инициализацию и восстанавливает DOM.
 */
export function initScrollable(
  el: HTMLElement,
  userOptions?: Partial<ScrollableOptions>,
): () => void {
  const opts: ScrollableOptions = {...DEFAULTS, ...readDataConfig(el), ...userOptions};
  const disposers: Array<() => void> = [];

  const horizontal = opts.orientation === 'horizontal';

  const applyConfig = (): void => {
    wrapper.style.setProperty('--x-scroll-thumb-width', `${opts.thumbWidth}px`);
    wrapper.style.setProperty('--x-scroll-thumb-color', opts.thumbColor);
    wrapper.style.setProperty('--x-scroll-thumb-radius', `${opts.thumbRadius}px`);
    wrapper.style.setProperty('--x-scroll-track-offset', `${opts.trackOffset}px`);
  };

  // --- Прокручиваемый контекст и позиционирование для трека ---
  const axis = horizontal ? 'overflowX' : 'overflowY';
  const computedStyle = getComputedStyle(el);
  if (computedStyle[axis] !== 'auto' && computedStyle[axis] !== 'scroll') {
    el.style[axis] = 'auto';
  }
  el.classList.add('x-scrollable');

  // --- Оборачиваем элемент, чтобы трек был абсолютным соседом ---
  const wrapper = document.createElement('div');
  wrapper.className = 'x-scrollable__wrapper';
  if (horizontal) wrapper.classList.add('is-horizontal');
  el.parentNode?.insertBefore(wrapper, el);
  wrapper.appendChild(el);

  const track = document.createElement('div');
  // is-pending держит трек невидимым до первого update():
  // иначе между созданием и первым расчётом метрик виден флеш тумба
  track.className = 'x-scrollable__track is-pending';
  const thumb = document.createElement('div');
  thumb.className = 'x-scrollable__thumb';
  track.appendChild(thumb);
  wrapper.appendChild(track);
  applyConfig();

  // --- Состояние ---
  let isDragging = false;
  let dragStartPointer = 0;
  let dragStartScroll = 0;
  let fadeTimer: ReturnType<typeof setTimeout> | null = null;

  const computeMetrics = (): ScrollMetrics => {
    if (horizontal) {
      const {clientWidth, scrollWidth, scrollLeft} = el;
      const contentSize = Math.max(scrollWidth, 1);
      const visibleRatio = Math.min(1, clientWidth / contentSize);
      const thumbSize = Math.max(opts.minThumbSize, clientWidth * visibleRatio);
      const maxThumbPos = Math.max(0, clientWidth - thumbSize);
      const maxScroll = Math.max(0, scrollWidth - clientWidth);
      return {clientSize: clientWidth, scrollSize: scrollWidth, scrollPos: scrollLeft, thumbSize, maxThumbPos, maxScroll};
    }
    const {clientHeight, scrollHeight, scrollTop} = el;
    const contentHeight = Math.max(scrollHeight, 1);
    const visibleRatio = Math.min(1, clientHeight / contentHeight);
    const thumbHeight = Math.max(opts.minThumbSize, clientHeight * visibleRatio);
    const maxThumbTop = Math.max(0, clientHeight - thumbHeight);
    const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
    return {clientSize: clientHeight, scrollSize: scrollHeight, scrollPos: scrollTop, thumbSize: thumbHeight, maxThumbPos: maxThumbTop, maxScroll: maxScrollTop};
  };

  const update = (): void => {
    track.classList.remove('is-pending');
    const m = computeMetrics();
    const needsScroll = m.maxScroll > 1;
    track.classList.toggle('is-hidden', !needsScroll);
    if (!needsScroll) return;
    const scrollRatio = m.maxScroll > 0 ? m.scrollPos / m.maxScroll : 0;
    const thumbPos = m.maxThumbPos * Math.min(1, Math.max(0, scrollRatio));
    if (horizontal) {
      thumb.style.width = `${m.thumbSize}px`;
      thumb.style.transform = `translateX(${thumbPos}px)`;
    } else {
      thumb.style.height = `${m.thumbSize}px`;
      thumb.style.transform = `translateY(${thumbPos}px)`;
    }
  };

  const show = (): void => {
    if (!opts.autoHide) return;
    track.classList.remove('is-faded');
    if (fadeTimer !== null) clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      if (!isDragging) track.classList.add('is-faded');
    }, opts.fadeDelay);
  };

  // --- Синхронизация со скроллом ---
  const onScroll = (): void => {
    update();
    show();
  };
  el.addEventListener('scroll', onScroll, {passive: true});
  disposers.push(() => el.removeEventListener('scroll', onScroll));

  // --- Resize observers: элемент + прямые дети ---
  const elementRO = new ResizeObserver(() => update());
  elementRO.observe(el);
  disposers.push(() => elementRO.disconnect());

  const childRO = new ResizeObserver(() => update());
  const observedChildren = new Set<Element>();
  const observeChildren = (): void => {
    for (const child of el.children) {
      if (observedChildren.has(child)) continue;
      observedChildren.add(child);
      childRO.observe(child);
    }
  };
  observeChildren();
  disposers.push(() => childRO.disconnect());

  // --- Mutation observer: добавление/удаление детей, смена class/style/hidden ---
  const mo = new MutationObserver((mutations) => {
    for (const mut of mutations) {
      mut.addedNodes.forEach((n) => {
        if (n.nodeType !== 1 || n === track || n === wrapper) return;
        observedChildren.add(n as Element);
        childRO.observe(n as Element);
      });
      mut.removedNodes.forEach((n) => {
        if (n.nodeType !== 1 || !observedChildren.has(n as Element)) return;
        observedChildren.delete(n as Element);
        childRO.unobserve(n as Element);
      });
    }
    update();
  });
  mo.observe(el, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'hidden'],
  });
  disposers.push(() => mo.disconnect());

  // --- Перетаскивание тумба (pointer events: мышь + тач + стилус) ---
  const onPointerMove = (e: PointerEvent): void => {
    if (!isDragging) return;
    const m = computeMetrics();
    if (m.maxThumbPos === 0) return;
    const client = horizontal ? e.clientX : e.clientY;
    const d = client - dragStartPointer;
    const scrollDelta = (d / m.maxThumbPos) * m.maxScroll;
    if (horizontal) {
      el.scrollLeft = dragStartScroll + scrollDelta;
    } else {
      el.scrollTop = dragStartScroll + scrollDelta;
    }
  };

  const onPointerUp = (): void => {
    if (!isDragging) return;
    isDragging = false;
    thumb.classList.remove('is-dragging');
    document.body.style.userSelect = '';
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    show();
  };

  const onThumbPointerDown = (e: PointerEvent): void => {
    if (e.button && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
    dragStartPointer = horizontal ? e.clientX : e.clientY;
    dragStartScroll = horizontal ? el.scrollLeft : el.scrollTop;
    thumb.classList.add('is-dragging');
    document.body.style.userSelect = 'none';
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    show();
  };
  thumb.addEventListener('pointerdown', onThumbPointerDown);
  disposers.push(() => {
    thumb.removeEventListener('pointerdown', onThumbPointerDown);
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  });

  // --- Клик по треку (прыжок, как у нативного скроллбара) ---
  const onTrackPointerDown = (e: PointerEvent): void => {
    if (e.target === thumb) return;
    e.preventDefault();
    const rect = track.getBoundingClientRect();
    const m = computeMetrics();
    const clickPos = horizontal ? e.clientX - rect.left : e.clientY - rect.top;
    const targetThumbPos = clickPos - m.thumbSize / 2;
    const clamped = Math.max(0, Math.min(targetThumbPos, m.maxThumbPos));
    const scrollRatio = m.maxThumbPos > 0 ? clamped / m.maxThumbPos : 0;
    if (horizontal) {
      el.scrollLeft = scrollRatio * m.maxScroll;
    } else {
      el.scrollTop = scrollRatio * m.maxScroll;
    }
  };
  track.addEventListener('pointerdown', onTrackPointerDown);
  disposers.push(() => track.removeEventListener('pointerdown', onTrackPointerDown));

  // --- Hover (визуальный отклик + отмена autoHide-затухания) ---
  const onEnter = (): void => {
    track.classList.add('is-hovered');
    show();
  };
  const onLeave = (): void => {
    track.classList.remove('is-hovered');
    if (!isDragging) show();
  };
  wrapper.addEventListener('mouseenter', onEnter);
  wrapper.addEventListener('mouseleave', onLeave);
  disposers.push(() => {
    wrapper.removeEventListener('mouseenter', onEnter);
    wrapper.removeEventListener('mouseleave', onLeave);
  });

  // --- Первый рендер (после раскладки) ---
  const rafId = requestAnimationFrame(() => {
    update();
    show();
  });
  disposers.push(() => cancelAnimationFrame(rafId));
  disposers.push(() => {
    if (fadeTimer !== null) clearTimeout(fadeTimer);
  });

  // --- Полный демонтаж ---
  return () => {
    for (const dispose of disposers) dispose();
    disposers.length = 0;
    track.remove();
    observedChildren.clear();
    if (wrapper.parentNode) {
      wrapper.parentNode.insertBefore(el, wrapper);
      wrapper.remove();
    }
    el.classList.remove('x-scrollable');
    el.style.removeProperty(horizontal ? 'overflow-x' : 'overflow-y');
  };
}

/** Инициализирует все `[data-scrollable]` внутри root. Возвращает дипозеры. */
export function initScrollables(root: ParentNode = document): Array<() => void> {
  const elements = root.querySelectorAll<HTMLElement>('[data-scrollable]');
  return Array.from(elements, (el) => initScrollable(el));
}
