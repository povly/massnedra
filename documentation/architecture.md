[← Быстрый старт](getting-started.md) · [К README](../README.md) · [Данные и ассеты →](data-pipeline.md)

# Архитектура

Полные архитектурные guidelines: `.ai-factory/ARCHITECTURE.md`. Здесь — краткая
рабочая справка.

## Обзор: слоистая архитектура без фреймворка

Статический фронтенд на ванильном TypeScript. Четыре условных слоя:

```
ПРЕДСТАВЛЕНИЕ   ui/ (listView, objectView, panelSwitcher) + dom.ts + css/
      ↓ читает
СОСТОЯНИЕ       navigation.ts (автомат NavState + стек истории)
      ↓ описывает
ДАННЫЕ          data/ (plots.ts, groupPlots.ts) + types.ts
      ↓ отображает
ИНФРАСТРУКТУРА  map/ (createMap, plotPlacemarks, plotPolygons) + vendor/
```

## Структура каталогов

```
src/                        # веб-корень Vite
├── index.html              # единственная страница; подключает Яндекс.Карты API 2.1
├── js/
│   ├── main.ts             # вход: композиция, обработчики событий, единый render()
│   ├── navigation.ts       # владелец NavState и стека истории; переходы через transition()
│   ├── dom.ts              # все ссылки на DOM-элементы в одном месте
│   ├── types.ts            # общие типы: NavState, Plot и др.
│   ├── data/
│   │   ├── plots.ts        # участки (ГЕНЕРИРУЕТСЯ build-plots-data.py)
│   │   └── groupPlots.ts   # группировка участков по районам
│   ├── map/
│   │   ├── createMap.ts    # инициализация Яндекс.Карты
│   │   ├── plotPlacemarks.ts # точки участков
│   │   └── plotPolygons.ts # полигоны участков
│   ├── ui/
│   │   ├── listView.ts     # списки регионов/районов/участков
│   │   ├── objectView.ts   # карточка участка
│   │   └── panelSwitcher.ts# переключение панелей
│   └── vendor/
│       └── scrollable.ts   # сторонний код, изолирован
├── css/                    # style.css, scrollable.css
└── assets/                 # исходные ассеты
public/                     # статика без обработки: geo/, fonts/, images/
docs/                       # ВЫВОД СБОРКИ — не редактировать руками
scripts/                    # генерация данных и ассетов
```

## Правила зависимостей

- ✅ `main.ts` → все слои (композиция)
- ✅ `ui/` → `dom.ts`, `types.ts`, `data/` (рендер читает данные)
- ❌ `data/` не знает о `ui/`, `map/`, `navigation.ts`
- ❌ `navigation.ts` без DOM и API — чистое состояние
- ❌ Прямые вызовы `ymaps.*` только внутри `map/`

## Поток данных (навигация)

1. Клик пользователя → обработчик в `main.ts`
2. `main.ts` вызывает `navigation.openDistricts() / openPlots() / openObject(name) / goBack()`
3. Внутри срабатывает `transition(next)`: состояние меняется, предыдущее пишется в стек истории
4. `main.ts` вызывает `render()` → функции `ui/` перерисовывают панель, `map/` — карту

Ключевое решение: «назад» идёт по стеку `NavState[]` шаг за шагом
(объект B → объект A → список точек → районы → регионы), а не сбрасывает в начало.

## Сборка и целевые браузеры

- Vite 8, web root `src/`, вывод в `docs/` (GitHub Pages, base `/massnedra/`)
- lightningcss + browserslist: `IE 11, android 4.4, ios 9`
- Babel + `babel-plugin-polyfill-corejs3` (usage-global) поверх esbuild-трансформа
- Кастомный плагин `scripts/viteCombineMediaQuery.js` объединяет одинаковые `@media`
  в финальном бандле (mobile-first порядок)

## См. также

- [Данные и ассеты](data-pipeline.md) — генерация `data/plots.ts` и `geo/regions.json`
- [Деплой](deployment.md) — путь кода до GitHub Pages
