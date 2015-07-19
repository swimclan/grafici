var gulp 			 = require('gulp'),
		jshint		 = require('gulp-jshint'),
		rename 		 = require('gulp-rename'),
		uglify		 = require('gulp-uglify');

gulp.task('jshint', function() {
  return gulp.src('js/grafici.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish-ex'));
});

gulp.task('build-js', ['jshint'], function() {
	return gulp.src('js/grafici.js')
		.pipe(uglify())
		.pipe(rename('grafici.min.js'))
		.pipe(gulp.dest('js/'));
});

gulp.task('default', ['build-js', 'watch']);

gulp.task('watch', function() {
	gulp.watch('js/**/*.js', ['build-js']);
});