const { src, dest } = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulp = require("gulp");
const csso = require('gulp-csso');

const js = () =>
    src([
        'jst/jst.js',
        'jst/Biscuit.js',
        'jst/Num.js',
        'jst/Toast.js',
        'jst/Moment.js',
        'jst/Connect.js',
        'jst/Form.js',
        'jst/OverlayManager.js',
        'jst/Modal.js',
        'jst/Dialog.js',
        'jst/Icon.js',
        'jst/ActiveNav.js',
        'jst/Scrollbar.js',
        'jst/SimPro.js',
    ])
        .pipe(concat('jst-min.js'))
        .pipe(uglify())
        .pipe(dest('dist'));


gulp.task('css', function () {
        return gulp.src('jst/jst.css')
            .pipe(csso())
            .pipe(concat('jst-min.css'))
            // Output
            .pipe(gulp.dest('dist'))
});

exports.js = js