var sourcemaps = require('gulp-sourcemaps');
var fileinclude = require('gulp-file-include');
var prettify = require('gulp-prettify');
var $ = require('gulp-load-plugins')();
var csscomb = require('gulp-csscomb');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var gulp = require('gulp');
var babel = require('gulp-babel');


function handleError(err) {
    console.log(err)
}
gulp.task('fileinclude', function () {
	return gulp.src(['src/index.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./public'))
		.pipe(connect.reload());
});
gulp.task('prettify', ['fileinclude'], function () {
	return gulp.src('public/*.html')
		.pipe(prettify({indent_size: 2}))
		.pipe(gulp.dest('public'))
		.pipe(connect.reload());
});


gulp.task('styles', function () {
    gulp.src('src/less/style.less')
        .pipe(plumber(handleError))
        .pipe($.less({}))
        .on('error', handleError)
        .pipe($.autoprefixer([
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6']))
        .pipe($.csscomb())
        .pipe(gulp.dest('public/css'))
        .pipe(connect.reload())
});

gulp.task('scripts', function () {
    gulp.src([
            'src/js/lodash.js',
            'src/js/cash.min.js',
            'src/js/init.js'

        ])
        .pipe(plumber(handleError))
        .pipe(sourcemaps.init())
        .on('error', handleError)
        .pipe(concat('app.js'))
        .pipe(babel({loose: 'all'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload());
});




gulp.task('html', function () {
    return gulp.src([
            'src/index.html'
        ])
        .pipe(gulp.dest('public/'))
        .pipe(connect.reload());

});

gulp.task('watch', ['build', 'connect'], function () {

    gulp.watch('src/less/*.less', ['styles']);
    gulp.watch(['src/js/*.js'], ['scripts']);
	gulp.watch('src/views/*.html', ['prettify']);

});

gulp.task('connect', function () {
    connect.server({
        root: ['public'],
        port: 4242,
        livereload: true
    })
});
gulp.task('build', function () {
    gulp.run([ 'styles', 'scripts','prettify'])
});
gulp.task('default', function () {
    gulp.run('watch');
});