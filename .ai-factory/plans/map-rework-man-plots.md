# Implementation Plan: Переработка карты под датасет МАН

Branch: none (git.create_branches = false — работа в текущей ветке `main`)
Created: 2026-09-06

## Original Request
теперь надо переделать карту, тоесть другие данные, у нас будут области, потом районы и тут список участков. В целом точки у нас удаляются /home/povly/Загрузки/Telegram Desktop/Объекты_для_размещения_на_сайте_МАН.xlsx А так получается на участке выделяем территорию с площадью и границами, ну у нас есть все это! Сохрани конечно, архивируй куда-то чтобы в дайльнешем могли его использовать

Дополнение (следующее сообщение): а забыл и чтобы метка была по центру территории!

## Settings
- Testing: no — тестового фреймворка нет; верификация `npm run build` + ручной сценарий в браузере
- Logging: minimal — по `rules/base.md` новое логирование не добавляется; в генераторе сохраняются существующие print-итоги
- Docs: yes — обновить `documentation/data-pipeline.md`, `documentation/architecture.md`, `README.md`

## Решения по требованиям (зафиксировано на планировании)
1. **Иерархия не меняется:** «области → районы → список участков» — это уже
   реализованный автомат `navigation.ts` (regions → districts → plots → object).
   Меняются данные и карта, НЕ навигация.
2. **Точки:** старые «приблизительные» точки (центры районов из
   `district-centers.json`, фолбэк на центроид региона) удаляются. Метка участка
   остаётся, но ВСЕГДА в центроиде полигона территории. У нового датасета полигоны
   есть у всех 25 участков → метка всегда точная, флаг `approximated` не нужен.
3. **Клик по полигону** выбирает участок (замена UX-паритета удалённых точек,
   подтверждено пользователем). Клик по метке тоже выбирает (как сейчас).
4. **Данные нового xlsx** (проверено чтением файла): 25 строк × 6 колонок
   (Участок / Регион / Расположение / Площадь км² / Полезные ископаемые /
   Координаты ГСК-2011 DMS построчно, 4 вершины у всех). Карточные поля теперь
   прямо в xlsx → сопоставление с `plots-site.json` и словарь ALIASES не нужны.
   Имена без «№». Регионы: Иркутская, Магаданская, Хабаровский, Приморский —
   все покрыты `public/geo/regions.json`. Разнобой районов
   («Вяземский район» / «Вяземский муниципальный район», «Охотский район» /
   «Охотский муниципальный округ», «Сусуманский городской округ») склеивается
   существующими `normalizeDistrict()` / `districtKey()`.
5. **Архивация:** старый датасет сохраняется в репо (`scripts/archive/plots-v1/`):
   `plots-site.json`, `district-centers.json`, снапшот старого `plots.ts`.
   Прежний xlsx в репо отсутствовал (приходил аргументом из Загрузок) — факт
   фиксируется в `scripts/archive/plots-v1/README.md`.
6. **Источник нового xlsx кладём в репо** (`scripts/source/`) — иначе пайплайн
   невоспроизводим (файл живёт в Telegram-загрузках).

## Commit Plan
- **Commit 1** (после задач 1–2): `chore: archive plots-v1 dataset, add MAN xlsx source`
- **Commit 2** (после задач 3–4): `feat(data): single-source MAN plot generator`
- **Commit 3** (после задач 5–7): `feat(map): centroid markers, polygon click, drop approximated points`
- **Commit 4** (после задач 8–9): `docs: update pipeline and map docs for MAN dataset`

## Tasks

### Фаза 1: Архивация и источник данных
- [x] T1. Архивировать старый датасет. `mkdir -p scripts/archive/plots-v1`;
  переместить туда `scripts/plots-site.json` и `scripts/district-centers.json`
  (`git mv`), скопировать текущий `src/js/data/plots.ts` как
  `scripts/archive/plots-v1/plots-v1.ts.txt`. Написать
  `scripts/archive/plots-v1/README.md`: происхождение (карточки
  massnedra.com/investicionnye-proekty + xlsx ГСК-2011 из Telegram), формат имён
  «№NN. Имя», дата архивации, что старый xlsx в репо не хранился. Проверка:
  `npm run build` пока НЕ запускать (plots.ts ещё старый — это ок).
  Логирование: без нового (rules/base.md).
  Файлы: `scripts/archive/plots-v1/*`.
- [x] T2. Положить новый источник в репо: `mkdir -p scripts/source`, скопировать
  xlsx из `/home/povly/Загрузки/Telegram Desktop/Объекты_для_размещения_на_сайте_МАН.xlsx`
  → `scripts/source/Объекты_для_размещения_на_сайте_МАН.xlsx` (копировать через
  glob — имя содержит «й», возможна NFD-нормализация). Проверка: `git status`
  показывает новый файл; размер > 0.
  Логирование: без нового.
  Файлы: `scripts/source/Объекты_для_размещения_на_сайте_МАН.xlsx`.

### Фаза 2: Генератор данных
- [x] T3. Переписать `scripts/build-plots-data.py` под один источник. Удалить:
  `SITE_JSON`, `CENTERS_JSON`, `ALIASES`, `FILLER_WORDS`, `norm()`,
  `parse_card_desc()`, сопоставление карточек, дедупликацию, №-сортировку
  (`sort_key`), фолбэки `plot_point()` (district-centers, центроид региона).
  Сохранить: `dms_to_decimal()`, `parse_xlsx()` (те же 6 колонок),
  `resolve_xlsx()` (Unicode-фолбэк). Логика: `point` = центроид полигона
  (среднее вершин, округление 7 знаков); полигон < 3 вершин → участок в итог
  не попадает, печатается предупреждение. Сортировка: `(region, name)` —
  `localeCompare`-совместимо с JS-сортировкой списков. Docstring: новый запуск
  `uv run --with openpyxl python3 scripts/build-plots-data.py
  scripts/source/Объекты_для_размещения_на_сайте_МАН.xlsx`. Формат вывода
  `plots.ts` не меняется (PlotArea с point и polygon).
  Логирование: существующие print-итоги (кол-во участков, путь записи,
  предупреждения о битых полигонах) — сохранить и дополнить случаем «пропущен
  участок без полигона».
  Файлы: `scripts/build-plots-data.py`.
- [x] T4. Сгенерировать и сверить данные. Запуск команды из docstring; ожидание:
  `Участков: 25, с полигонами: 25`. Ручная сверка: центроид «Мантагыр»
  (53°30'41"–53°35'25" с.ш., 99°20'–99°32' в.д. ≈ [53.54, 99.44]) в `plots.ts`;
  имена без «№»; регионы/районы без обрезки. Проверка типов: `npx tsc --noEmit`
  (старый TS-код ещё совместим: поля PlotArea не менялись).
  Логирование: вывод генератора.
  Файлы: `src/js/data/plots.ts` (сгенерированный).

### Фаза 3: Карта, UI, верификация, документация
- [x] T5. Метки в центрах территорий. `src/js/types.ts`: обновить JSDoc
  `PlotArea.point` → «центроид территории (запечён при генерации)».
  `src/js/map/plotPlacemarks.ts`: удалить `APPROXIMATE_NOTE`, флаг
  `approximated` и ветку `if (!plot.point) continue;` оставить как guard;
  балун — без пометки о приблизительности. Рефакторинг: глобальный
  `mapFocusRef`/`setMapFocusHandler` удалить; выбор участка — через параметр
  `createPlotPlacemarks(plots, onSelect: (plot: PlotArea) => void)`.
  Логирование: без нового. Файлы: `src/js/types.ts`,
  `src/js/map/plotPlacemarks.ts`.
- [x] T6. Клик по полигону выбирает участок. `src/js/map/plotPolygons.ts`:
  `create(plots, map, onSelect)` — на каждый `ymaps.Polygon` повесить
  `events.add('click', () => onSelect(plot))`. В `src/js/types.ts` дополнить
  тип `YmapsPolygon` минимальным `events.add('click', ...)` (по образцу
  `YmapsPlacemark`), не `<any>`.
  Логирование: без нового. Файлы: `src/js/map/plotPolygons.ts`, `src/js/types.ts`.
- [x] T7. Интеграция в main.ts. `src/js/main.ts`: убрать импорт
  `setMapFocusHandler` и вызов `setMapFocusHandler(...)`; в `ymaps.ready` —
  `createPlotPlacemarks(plots, selectPlot)` и `plotPolygons.create(plots, map,
  selectPlot)` (объявить `selectPlot` до блока `ymaps.ready` — он function
  declaration, hoisting работает, но проверить порядок чтения). В `focusPlot`
  удалить ветку «участок без координат → fitTo(районы)» (у всех участков теперь
  есть точка-центроид; оставить простой guard `if (!map || !match) return;`).
  `setPlacemarksVisible`, `boundsOf`, `MIN_VIEW_SPAN`, `fitTo` — без изменений.
  Логирование: существующий `console.warn` в `render` остаётся.
  Файлы: `src/js/main.ts`.
- [ ] T8. Верификация. `npm run build` (assets → tsc --noEmit → vite build) —
  0 ошибок. Ручной чек-лист в браузере (`npm run dev`): 25 полигонов на карте;
  метки стоят в центрах территорий (проверить 2–3 по зуму); клик по полигону и
  клик по метке открывают карточку + подсветку; навигация назад по истории
  (объект → список участков → районы → области); исчезающие метки при входе в
  район (`setPlacemarksVisible`); зум fitTo по уровням.
  Логирование: вывод сборки. Файлы: без изменений (только проверки).
- [ ] T9. Документация. `documentation/data-pipeline.md`: новый пайплайн
  (один источник xlsx из `scripts/source/`, без plots-site.json/ALIASES,
  точка = центроид), раздел про архив `scripts/archive/plots-v1/`.
  `documentation/architecture.md`: строка map/ — «метки в центрах территорий,
  клик по полигону/метке выбирает участок». `README.md`: пример PlotArea —
  имена без «№», point = центроид. Обновить AGENTS.md не требуется (структура
  каталогов не менялась, scripts/source и scripts/archive добавить в дерево).
  Логирование: n/a. Файлы: `documentation/data-pipeline.md`,
  `documentation/architecture.md`, `README.md`, `AGENTS.md`.
