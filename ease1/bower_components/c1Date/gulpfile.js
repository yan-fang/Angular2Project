var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('uglify', function () {
    return gulp.src('js/c1Date.js')
        .pipe(uglify())
        .pipe(rename('c1Date.min.js'))
        .pipe(gulp.dest('min'));
});

gulp.task('default', ['uglify']);