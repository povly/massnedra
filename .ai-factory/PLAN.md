# Refactor: Typed Modular Map Script + x-scrollable, Drop Unused Icons

- **Date:** 2026-09-05
- **Mode:** fast (no branch, work on `main`)
- **Scope:** `src/js/*`, `src/css/*`, `src/index.html`, `public/`, `package.json`, `tsconfig.json`

## Original Request
иконки у нас нет, просто удалить, и типизируй все в скрипте, и по возможности разделяй логику - на наподобиен Solid принципу!
(уточнения: скролл — взять из bronber-store `resources/js/alpine/plugins/scrollable.js` + `resources/css/components/scrollable.css`, без Alpine; SimpleBar убрать; tsc --noEmit + strict в build)

## Settings
- **Testing:** no — статический лендинг без тестовой инфраструктуры; верификация сборкой + preview/curl
- **Logging:** minimal — только `console.warn` при отсутствии обязательных DOM-узлов (fail fast с именем селектора)
- **Docs:** no (warn-only)

## Tasks

### T1. Удалить неиспользуемые иконки
- [ ] Удалить `public/icons.svg` — grep по `src/` подтверждает: ни одного `use href="/icons.svg#..."` в разметке нет (спрайт остался от старого шаблона).
- [ ] `public/favicon.svg` НЕ трогать — используется в `<head>`.
- Файлы: `public/icons.svg` (delete).
- Ожидаемый результат: файл исчезает из `dist/` после пересборки, страница не меняется.

### T2. Заменить SimpleBar на x-scrollable (порт из bronber-store)
- [ ] Создать `src/js/vendor/scrollable.ts` — адаптация `resources/js/alpine/plugins/scrollable.js` из povly/bronber-store:
  - убрать Alpine-обёртку (`Alpine.directive`, `evaluate`, `effect`, `cleanup`) — проект без Alpine;
  - экспорт `initScrollable(el: HTMLElement, options?: Partial<ScrollableOptions>): () => void` (возвращает disposer — симметрия cleanup);
  - конфиг: дефолты плагина (orientation/thumbColor/thumbWidth/thumbRadius/trackOffset/minThumbSize/autoHide/fadeDelay) + переопределение через JSON в `data-scrollable` атрибуте;
  - авто-инициализация: `initScrollables(root: ParentNode)` сканирует `[data-scrollable]` — вызывает из main.ts;
  - DOM-результат и поведение 1:1 с оригиналом: wrapper/track/thumb, классы `is-pending/is-hidden/is-faded/is-dragging`, CSS-переменные `--x-scroll-*`, ResizeObserver + MutationObserver, pointer-drag, click-jump по треку.
- [ ] Создать `src/css/scrollable.css` — перенос `resources/css/components/scrollable.css` из bronber-store 1:1 (вложенность поглотится lightningcss-таргетами); селектор `[x-scrollable]` заменить на `[data-scrollable]` в правиле сокрытия нативного скроллбара.
- [ ] `src/css/style.css`: подключить `@import './scrollable.css';` вверху; удалить весь simplebar-блок (секция «Scrollbar», строки ~1–270: `.simplebar-*`, `[data-simplebar]`).
- [ ] `src/index.html`: на `.p-map__item-content` заменить `data-simplebar data-simplebar-auto-hide="false"` → `data-scrollable`.
- Файлы: `src/js/vendor/scrollable.ts` (new), `src/css/scrollable.css` (new), `src/css/style.css`, `src/index.html`.
- Ожидаемый результат: кастомный скроллбар в `.p-map__item-content` работает как раньше (вертикальный, постоянный — autoHide false), SimpleBar полностью исчез из кода и бандла.

### T3. Типизация и модульная декомпозиция main.ts (SRP/SOLID)
Нарезка `src/js/main.ts` (2319 строк: вендор SimpleBar + данные + вся логика) на модули с одним направлением зависимостей:

- [ ] `src/js/types.ts` (new):
  - `interface MapPoint { coordinates: [number, number]; properties: MapPointProperties; filter: string }`;
  - `interface MapPointProperties { balloonTitle: string; balloonContent: string; address: string }`;
  - `interface ScrollableOptions { ... }` — конфиг скролла из T2;
  - ambient-типы Яндекс.Карт под используемую поверхность API: `ymaps.ready`, `ymaps.Map`, `ymaps.Clusterer`, `ymaps.Placemark`, `ymaps.templateLayoutFactory.createClass`, `ymaps.control.ZoomControl` (минимальные интерфейсы, без внешних d.ts);
  - `declare global { const ymaps: YmapsApi }` (глобал приходит из `<script src="api-maps.yandex.ru">`).
- [ ] `src/js/data/points.ts` (new): `export const points: readonly MapPoint[]` — перенос массива ~75 объектов 1:1, без изменений содержимого.
- [ ] `src/js/dom.ts` (new): типизированные геттеры всех используемых узлов (`.p-map__item`, `.p-map__show`, `.p-map__groups`, `.p-map__places`, `.p-map__object`, `.p-map__places-title`, `.p-map__places-items`, `.p-map__object-title`, `.p-map__object-subtitle`, `.p-map__object-text`) — `querySelector<T>` + throw `console.warn`+Error с именем селектора, если узла нет.
- [ ] `src/js/map/createMap.ts` (new): создание карты (центр/zoom/controls), кастомный layout кластера (счётчик точек), `ymaps.Clusterer`, zoom control; возвращает `{ map, clusterer }`.
- [ ] `src/js/map/placemarks.ts` (new): `createPlacemarks(points, onPointClick: (p: MapPoint) => void)` — метки со стандартной/выделенной иконкой (tildacdn-ассеты как есть), клик → `onPointClick`.
- [ ] `src/js/ui/groupsView.ts` (new): `renderGroups(container, points): string[]` — регионы + счётчики, сортировка `localeCompare`, делегирование кликов через коллбек.
- [ ] `src/js/ui/placesView.ts` (new): `renderPlaces(itemsContainer, titleEl, region, regionPoints, onPlaceClick)`.
- [ ] `src/js/ui/objectView.ts` (new): `renderObject(els, point)` — title/subtitle (`address.split('<br>')[0]`)/textContent.
- [ ] `src/js/ui/panelSwitcher.ts` (new): единственная точка смены видимости панелей (классы `active` на groups/places/object) — вместо рассыпанных `classList.add/remove` по коду.
- [ ] `src/js/navigation.ts` (new): состояние `currentRegion` + переходы назад (object→places→groups с восстановлением фильтра карты) — получает switcher и коллбеки через параметры (DIP), сам DOM-структуру не знает.
- [ ] `src/js/main.ts` (rewrite): композиционный корень — `initScrollables(document)`, обработчик `.p-map__show` (toggle active), `ymaps.ready(...)` собирает карту, метки, подписки, стартовую фильтрацию и bounds. ~100 строк.
- **Правила зависимостей (без циклов):** `types` ← `data`/`dom`/`map`/`ui` ← `navigation` ← `main`; `ui`-модули не знают о `map` и наоборот — связывают только через коллбеки в main.
- Файлы: см. выше; `src/js/main.ts` переписывается.
- Ожидаемый результат: поведение страницы идентично текущему; каждый модуль — одна ответственность; типы покрывают весь свой код.

### T4. strict-типизация и проверка в сборке
- [ ] `package.json`: вернуть `typescript` в devDependencies; `build` → `"npm run assets && tsc --noEmit && vite build"`.
- [ ] `tsconfig.json`: `"strict": true`, `include: ["src"]`, `noEmit` уже есть; вендор-файл `src/js/vendor/scrollable.ts` тоже под strict (он наш типизированный).
- [ ] Погасить все ошибки `tsc --noEmit` до нуля (без `any`-эскейпов и `@ts-ignore`; для ymaps — аккуратные интерфейсы из types.ts).
- Файлы: `package.json`, `package-lock.json`, `tsconfig.json`, точечные правки модулей из T3.
- Ожидаемый результат: `npm run build` падает при любой ошибке типов; зелёная сборка = типы чистые.

### T5. Сборка, проверка, публикация
- [ ] `npm run build` зелёный: assets → tsc → vite.
- [ ] Проверки dist: `dist/icons.svg` отсутствует; в бандле нет `simplebar`; есть `x-scrollable__` (CSS+JS); `dist/index.html` содержит `data-scrollable` и api-maps script.
- [ ] `vite preview` + curl: страница 200, css/js резолвятся.
- [ ] Коммит + push в `origin/main`.

## Commit Plan
5 задач, но коммит один — атомарный рефакторинг: промежуточные состояния (simplebar-CSS удалён, новый не подключён; main.ts разрезан до конца) не собираются и ломают страницу.
- `refactor: typed modular map script, x-scrollable instead of simplebar, drop unused icons`

## Notes / Risks
- Alpine-специфика плагина (реактивный re-evaluate конфига через `effect`) не переносится — конфиг у нас статичен из data-атрибута; поведение скролла не меняется.
- Инлайн-SVG стрелки в разметке — контент страницы, а не иконки-спрайт: не удаляются (запрос «иконки у нас нет» относится к неиспользуемому спрайту `icons.svg`).
- Порядок T2 до T3: сначала меняем скролл на рабочем main.ts, потом режем модули — меньше конфликтов правок.
- ymaps-типы минимальные и наши: если позже понадобится больше API — расширять в `types.ts`.
