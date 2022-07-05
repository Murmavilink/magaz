// Основной модуль
import gulp from 'gulp'
// Импорт путей
import {path} from "./gulp/config/path.js"
// Импорт общих плагинов
import {plugins} from "./gulp/config/plugins.js"

// Передача значений в глобальную переменную
global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path,
    gulp,
    plugins
}

// Импорт задач (tasks)
import {copy} from "./gulp/tasks/copy.js"
import {reset} from "./gulp/tasks/reset.js"
import {html} from "./gulp/tasks/html.js"
import {scss} from "./gulp/tasks/scss.js"
import {js} from "./gulp/tasks/js.js"
import {images} from "./gulp/tasks/images.js"
import {svgSprite} from "./gulp/tasks/svgSprite.js"
import {server} from "./gulp/tasks/server.js"
import {zip} from "./gulp/tasks/zip.js"
import {ftp} from "./gulp/tasks/ftp.js"
import {otfToTtf, ttfToWoff, fontsStyle} from "./gulp/tasks/fonts.js"
import {scssLibs, jsLibs} from "./gulp/tasks/libs.js"

const libs = gulp.parallel(scssLibs, jsLibs)

// Функция-наблюдатель за изменениями в файлах
function watcher() {
    gulp.watch(path.watch.files, copy)
    gulp.watch(path.watch.html, html)
    gulp.watch(path.watch.scss, scss)
    gulp.watch(path.watch.js, js)
    gulp.watch(path.watch.images, images)
    gulp.watch(path.watch.scssLibs, libs)
    gulp.watch(path.watch.jsLibs, libs)
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle)

// Основные задачи (выполняются параллельно)
const mainTasks = gulp.parallel(copy, html, scss, js, images, fonts, libs)

// Построение сценариев и выполнение задач (внутри выполняются также и основные задачи)
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server))
const build = gulp.series(reset, mainTasks)
const deployZip = gulp.series(reset, mainTasks, zip)
const deployFtp = gulp.series(reset, mainTasks, ftp)

export {dev, build}
export {svgSprite}
export {deployZip}
export {deployFtp}

// Выполнение сценария по умолчанию (передается переменная, объединяющая все сценарии и задачи (из предыдущего пункта))
gulp.task('default', dev)

