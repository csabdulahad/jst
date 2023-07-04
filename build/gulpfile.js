const { src, dest } = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso');
const gulp = require("gulp");
const sourcemaps = require('gulp-sourcemaps');

gulp.task( 'js-min', () => {
    return src('../src/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('jst-min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('../dist'));
});

gulp.task('js-full', () => {
    return src('../src/*.js')
        .pipe(concat('jst.js'))
        .pipe(dest('../dist'));
});

gulp.task('css', () => {
    return gulp.src('../src/jst.css')
    .pipe(csso())
    .pipe(concat('jst-min.css'))
    .pipe(gulp.dest('../dist'))
});