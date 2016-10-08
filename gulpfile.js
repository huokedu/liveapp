var gulp = require('gulp'),
    less = require('gulp-less'),
    cssmin = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    pngquant = require('imagemin-pngquant');
gulp.task('less', function() {
    gulp.src("./static/src/less/app.less")
        .pipe(less())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssmin({}))
        .pipe(gulp.dest('./static/dist/css/'));
});
gulp.task('img', function() {
    gulp.src('./static/src/img/**/*.*')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./static/dist/img/'))
});
gulp.task('app', function() {
    gulp.src("./static/src/js/app.js")
        .pipe(rename({
            suffix: '.min'
        })) //rename压缩后的文件名
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('./static/dist/js/')); //输出
});
gulp.task('dev', function() {
    gulp.watch('./static/src/less/*.less', ['less']);
    gulp.watch('./static/src/js/app.js', ['app']);
    gulp.watch('./static/src/img/**/*.*', ['img']);
});
