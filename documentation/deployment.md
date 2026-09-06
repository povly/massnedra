[← Данные и ассеты](data-pipeline.md) · [К README](../README.md)

# Деплой

## Схема публикации

GitHub Pages настроен на ветку `main`, каталог `/docs`:

```
src/ + public/ --npm run build--> docs/ --git push--> GitHub Pages
```

- Base URL сайта: `/massnedra/` (задан в `vite.config.js`)
- Живой сайт: https://massnedra.com (домен подключён к Pages)

## Ручной деплой

```bash
npm run deploy
```

Скрипт выполняет: `npm run build` (ассеты + `tsc --noEmit` + `vite build`) →
`git add docs` → коммит `deploy: update built site` → `git push`.

## Что происходит внутри сборки

| Шаг | Инструмент | Результат |
|-----|------------|-----------|
| `assets:images / svg / fonts` | sharp, svgo, ttf2woff | Обновлённая статика в `public/` |
| `tsc --noEmit` | TypeScript | Проверка типов без эмиссии |
| `vite build` | Vite 8 | Минифицированный бандл в `docs/` |

Транспиляция: esbuild → Babel (`@babel/preset-env`, targets `ie 11, ios 9`) →
polyfills core-js 3. CSS: lightningcss с browserslist-таргетами; кастомный плагин
объединяет `@media`-запросы после минификации.

## Проверка перед пушем

1. `npm run build` проходит без ошибок типов
2. `npm run preview` — сайт открывается, карта загружается, навигация «назад»
   не сбрасывает в начало (см. `AGENTS.md`)
3. `git status` — в коммит попадает только `docs/`

## Рекомендации

- ❌ Не правьте файлы в `docs/` вручную — следующий деплой их перезапишет
- ✅ Разрабатывайте через `npm run dev` и деплойте готовое
- ✅ Если Pages отдаёт 404 — проверьте, что коммит с `docs/` долетел до `main`
  и в настройках репозитория Pages указан каталог `/docs`

## См. также

- [Быстрый старт](getting-started.md) — локальный запуск и preview
- [Данные и ассеты](data-pipeline.md) — если перед деплоем обновлялись данные
