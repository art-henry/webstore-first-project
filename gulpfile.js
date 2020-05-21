var gulp         = require('gulp'), // Подключаем Gulp
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
    spritesmith = require('gulp.spritesmith'), // Подключение библиотеки для создания спрайтов
    merge = require('merge-stream');

gulp.task('css', function(){ // Создаем таск Sass
    return gulp.src('src/css/**/*.css') // Берем источник
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
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
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['css'], function() {
    return gulp.src('app/css/style.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'css', 'scripts', 'sprite'], function() {
    gulp.watch('src/css/**/*.css', ['css']); // Наблюдение за css файлами в папке css
    gulp.watch('src/sprite/*.png', ['sprite']); // Наблюдение за папкой с картинками для спрайтов  папке sprite
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('app/img')); // Выгружаем на продакшен
});


gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);