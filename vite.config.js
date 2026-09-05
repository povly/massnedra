import {defineConfig} from 'vite';
import browserslist from 'browserslist';
import {browserslistToTargets} from 'lightningcss';
import {babel} from '@rollup/plugin-babel';
import {createRequire} from 'module';
import {combineMediaQueries} from './scripts/viteCombineMediaQuery.js';

const require = createRequire(import.meta.url);
const coreJsVersion = require('core-js/package.json').version;

const babelTargets = {ie: '11', ios: '9'};

export default defineConfig({
    // Исходники сайта живут в src/ — это веб-корень проекта
    root: 'src',
    publicDir: '../public',
    // GitHub Pages обслуживает проект по подпути /massnedra/
    base: '/massnedra/',
    css: {
        transformer: 'lightningcss',
        lightningcss: {
            targets: browserslistToTargets(
                browserslist([
                    '> 0.5%',
                    'last 2 versions',
                    'Firefox ESR',
                    'not dead',
                    'IE 11',
                    'android 4.4',
                    'ios 9',
                ])
            ),
        },
    },
    plugins: [
        // Объединяет одинаковые @media запросы в финальном бандле AFTER
        // lightningcss минификации + сортирует по min-width ascending
        // (mobile-first cascade correctness). Даёт cleaner gzip.
        combineMediaQueries(),

        babel({
            babelHelpers: 'bundled', // Важно! Это решит ошибку 'addHelper'
            exclude: 'node_modules/**',
            // .ts попадает сюда уже после esbuild-трансформа (чистый JS),
            // расширение оставлено, чтобы babel не пропускал модуль
            extensions: ['.js', '.jsx', '.ts', '.es6', '.es', '.mjs'],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: babelTargets,
                        modules: false,
                    },
                ],
            ],
            plugins: [
                [
                    'babel-plugin-polyfill-corejs3',
                    {
                        method: 'usage-global',
                        targets: babelTargets,
                        version: coreJsVersion,
                    },
                ],
            ],
        }),
    ],
    server: {
        port: 5173,
    },
    build: {
        // Сборка в docs/ — её отдаёт GitHub Pages (main + /docs)
        outDir: '../docs',
        emptyOutDir: true,
        cssMinify: 'lightningcss',
        minify: true,
        target: 'es2017',
    },
});
