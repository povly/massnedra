import {
  readdirSync,
  existsSync,
  mkdirSync,
  statSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import {join, extname, dirname, relative, basename} from 'path';
import {optimize} from 'svgo';

// Конфигурация SVGO для оптимизации SVG
const svgoConfig = {
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    'removeViewBox',
    'cleanupEnableBackground',
    'convertStyleToAttrs',
    'convertColors',
    'convertPathData',
    'convertTransform',
    'removeUselessStrokeAndFill',
    'removeUnknownsAndDefaults',
    'removeNonInheritGroupAttrs',
    'cleanupIDs',
    'cleanupNumericValues',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'removeRasterImages',
    'mergePaths',
    'convertShapeToPath',
    'sortAttrs',
    'removeDimensions',
  ],
};

const srcDir = 'src/assets/images';
const outputDir = 'public/images';

// Получаем аргументы командной строки
const args = process.argv.slice(2);
const targetPath = args[0]; // путь к папке или файлу

async function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, {recursive: true});
  }
}

async function optimizeSVG(inputPath, outputPath) {
  try {
    const svgContent = readFileSync(inputPath, 'utf8');
    const result = optimize(svgContent, svgoConfig);
    if (result.error) {
      throw new Error(result.error);
    }
    writeFileSync(outputPath, result.data);
    return true;
  } catch (error) {
    console.error(`❌ Ошибка оптимизации SVG ${inputPath}:`, error.message);
    // Если оптимизация не удалась, просто копируем оригинал
    copyFileSync(inputPath, outputPath);
    return false;
  }
}

async function processDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    console.log(`📁 Папка ${dirPath} не найдена.`);
    return;
  }
  const items = readdirSync(dirPath);
  let totalFiles = 0;
  let processedFiles = 0;
  for (const item of items) {
    const itemPath = join(dirPath, item);
    const stat = statSync(itemPath);
    if (stat.isDirectory()) {
      // Рекурсивно обрабатываем подпапки
      await processDirectory(itemPath);
    } else if (stat.isFile()) {
      const ext = extname(item).toLowerCase();
      if (ext === '.svg') {
        totalFiles++;
        // Вычисляем путь вывода с сохранением структуры папок
        const relativePath = relative(srcDir, dirname(itemPath));
        const targetDir = join(outputDir, relativePath);
        const outputPath = join(targetDir, item);
        await ensureDir(targetDir);
        const success = await optimizeSVG(itemPath, outputPath);
        if (success) processedFiles++;
        console.log(
          `${success ? '✅' : '⚠️'} Обработано: ${relative(process.cwd(), itemPath)} → ${relative(process.cwd(), outputPath)}`
        );
      }
    }
  }
  if (totalFiles > 0) {
    console.log(
      `\n📊 Обработано ${processedFiles}/${totalFiles} SVG файлов в ${dirPath}`
    );
  }
}

async function processSpecificFile(filePath) {
  if (!existsSync(filePath)) {
    console.error(`❌ Файл не найден: ${filePath}`);
    return false;
  }
  const stat = statSync(filePath);
  if (!stat.isFile()) {
    console.error(`❌ Указанный путь не является файлом: ${filePath}`);
    return false;
  }
  const ext = extname(filePath).toLowerCase();
  if (ext !== '.svg') {
    console.error(`❌ Файл не является SVG: ${ext}`);
    return false;
  }
  const filename = basename(filePath);
  console.log(`🎨 Оптимизируем файл: ${filename}`);
  // Вычисляем outputPath с сохранением структуры (предполагая, что filePath связан с srcDir)
  const relativePath = relative(srcDir, dirname(filePath));
  const targetDir = join(outputDir, relativePath);
  await ensureDir(targetDir);
  const outputPath = join(targetDir, filename);
  const success = await optimizeSVG(filePath, outputPath);
  if (success) {
    console.log(`✅ Файл успешно обработан: ${filename}`);
  }
  return success;
}

async function processSpecificDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    console.error(`❌ Папка не найдена: ${dirPath}`);
    return;
  }
  const stat = statSync(dirPath);
  if (!stat.isDirectory()) {
    console.error(`❌ Указанный путь не является папкой: ${dirPath}`);
    return;
  }
  console.log(`📁 Обрабатываем папку: ${dirPath}`);
  // Обрабатываем папку, сохраняя логику relativePath относительно srcDir
  await processDirectory(dirPath);
}

async function main() {
  console.log('🎨 Начинаем оптимизацию SVG файлов...\n');
  await ensureDir(outputDir);
  if (targetPath) {
    // Проверяем существование пути
    if (!existsSync(targetPath)) {
      console.error(`❌ Путь не найден: ${targetPath}`);
      console.log('\n💡 Использование:');
       console.log('   node optimize-svg.js [путь]');
       console.log('   /image.svg          # конкретный файл');
       console.log('   src/assets/images/gallery   # конкретная папка');
       console.log('   node optimize-svg.js     # вся папка src/assets/images');
      return;
    }
    const stat = statSync(targetPath);
    if (stat.isFile()) {
      // Обрабатываем конкретный файл
      await processSpecificFile(targetPath);
    } else if (stat.isDirectory()) {
      // Обрабатываем конкретную папку
      await processSpecificDirectory(targetPath);
    }
  } else {
    // Обрабатываем всю папку srcDir
    console.log(`📁 Обрабатываем всю папку: ${srcDir}`);
    await processDirectory(srcDir);
  }
  console.log('\n✨ Оптимизация SVG завершена!');
  console.log(`📁 Результат: ${outputDir}`);
}

main().catch(console.error);
