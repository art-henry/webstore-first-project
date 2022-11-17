const    gulp         = require('gulp'); // Подключаем Gulp
const    browserSync  = require('browser-sync'); // Подключаем Browser Sync
const    concat       = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
const    uglify       = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
const    cssnano      = require('gulp-cssnano'); // Подключаем пакет для минификации CSS
const    rename       = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
const    cache        = require('gulp-cache'); // Подключаем библиотеку кеширования
const    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
const    spritesmith  = require('gulp.spritesmith'); // Подключение библиотеки для создания спрайтов
const    merge        = require('merge-stream');

gulp.task('css', function(){ // Создаем таск Sass
    return gulp.src('src/css/**/*.css') // Берем источник
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('sprite', function () { // Создаем таск sprite
    var spriteData = gulp.src('src/sprite/*.png').pipe(spritesmith({ // Настройка спрайта
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        imgPath: '../img/sprite.png'
    }));
    // return spriteData.pipe(gulp.dest('app/img/')); // выгружаем спрайты в папку img
    var imgStream = spriteData.img
        .pipe(gulp.dest('app/img/'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('src/css/'));

    return merge(imgStream, cssStream);
});


gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('plugins.min.js')) // Собираем их в кучу в новом файле plugins.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')) // Выгружаем в папку app/js
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true}));
})

gulp.task('watch', function() {
    gulp.watch('src/css/**/*.css', gulp.parallel('css')); // Наблюдение за css файлами в папке css
    gulp.watch('src/sprite/*.png', gulp.parallel('sprite')); // Наблюдение за папкой с картинками для спрайтов  папке sprite
    gulp.watch('app/*.html', gulp.parallel('html')); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('src/js/**/*.js', gulp.parallel('scripts'));   // Наблюдение за JS файлами в папке js
});


gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', gulp.parallel('watch', 'browser-sync', 'clear'));