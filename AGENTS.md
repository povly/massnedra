# AGENTS.md

> Карта проекта для AI-агентов. Обновляйте при существенных изменениях структуры.

## Обзор проекта
Интерактивный лендинг о недрах с картой (Яндекс.Карты API): области → районы →
участки. Статический сайт на Vite + TypeScript, деплой на GitHub Pages.

## Технологический стек
- **Язык:** TypeScript ~6.0.2 (только devDependencies, без runtime-зависимостей)
- **Сборщик:** Vite ^8.2.2 (web root = `src/`, вывод в `docs/`)
- **CSS:** lightningcss + PostCSS, browserslist (IE 11, Android 4.4, iOS 9)
- **Карта:** Яндекс.Карты API 2.1 (внешний скрипт)

## Структура проекта
```
massendra/
├── src/                  # Веб-корень Vite
│   ├── index.html        # Единственная страница, подключает Яндекс.Карты
│   ├── js/               # TypeScript-модули
│   │   ├── main.ts       # Точка входа, рендер
│   │   ├── navigation.ts # Автомат навигации со стеком истории
│   │   ├── dom.ts        # Ссылки на DOM-элементы
│   │   ├── types.ts      # Общие типы (NavState и др.)
│   │   ├── data/         # Данные участков и регионов
│   │   ├── map/          # Обёртка Яндекс.Карт
│   │   ├── ui/           # Рендер списков и карточек
│   │   └── vendor/       # Сторонний код
│   ├── css/              # Стили (style.css, scrollable.css)
│   └── assets/           # Исходные ассеты
├── public/               # Статика без обработки (шрифты, favicon, geo, images)
├── scripts/              # Генерация ассетов (Node) и геоданных (Python)
│   ├── source/           # Исходные xlsx-датасеты участков
│   └── archive/          # Архив старых датасетов (plots-v1)
├── docs/                 # Собранный вывод vite build (НЕ редактировать руками)
├── .ai-factory/          # Артефакты AI Factory
└── .opencode/            # Скиллы OpenCode
```

## Ключевые точки входа
| Файл | Назначение |
|------|------------|
| `src/index.html` | Единственная страница сайта, подключение Яндекс.Карт |
| `src/js/main.ts` | Точка входа JS, инициализация и рендер |
| `src/js/navigation.ts` | Состояние навигации и стек истории |
| `vite.config.js` | Конфиг сборки (base `/massnedra/`, lightningcss, babel) |
| `package.json` | Скрипты: dev, build, deploy, assets |

## Документация
| Документ | Путь | Описание |
|----------|------|----------|
| README | README.md | Лендинг проекта: обзор, быстрый старт, ссылки |
| Быстрый старт | documentation/getting-started.md | Установка, npm-скрипты, первый запуск |
| Архитектура | documentation/architecture.md | Слои, модули, поток данных |
| Данные и ассеты | documentation/data-pipeline.md | Генерация геоданных и ассетов |
| Деплой | documentation/deployment.md | Сборка и публикация на GitHub Pages |
| Описание проекта | .ai-factory/DESCRIPTION.md | Стек, возможности, архитектурные заметки |
| Архитектура (AI) | .ai-factory/ARCHITECTURE.md | Архитектурные guidelines |
| Базовые правила | .ai-factory/rules/base.md | Автоопределённые соглашения кода |
| Конфиг AI Factory | .ai-factory/config.yaml | Языки, пути, git-настройки |

## Файлы контекста AI
| Файл | Назначение |
|------|------------|
| AGENTS.md | Карта проекта для агентов (этот файл) |
| .ai-factory/DESCRIPTION.md | Спецификация проекта |
| .ai-factory/ARCHITECTURE.md | Архитектурные guidelines |

## Правила для агентов
- Разбивайте составные shell-команды на отдельные вызовы
  - Неправильно: `git checkout main && git pull`
  - Правильно: сначала `git checkout main`, затем `git pull origin main`
- Не редактируйте `docs/` вручную — это вывод `vite build`
- Верификация изменений: `npm run build`
- Данные участков/регионов генерируются скриптами из `scripts/`, не редактируйте сгенерированное вручную
