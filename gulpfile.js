var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
concat = require('gulp-concat'),
uglify = require('gulp-uglifyjs'),
cssnano = require('gulp-cssnano'),
rename = require('gulp-rename'),
del = require('del'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
cache = require('gulp-cache'),
autoprefixer = require('gulp-autoprefixer');

/*
gulp.task('mytask',function(){
	console.log("Hello, I am task!");
});

gulp.task('task1',function(){
	return gulp.src('source-files') /* gulp.src - одна из базовых команд gulp,
		 которая для обработки берет какие-то файлы, которые попадают в данную выборку.
		 
	.pipe(plugin()) //вызов какой-то команды, плагина который что-то делает с файлом
	.pipe(gulp.dest('folder')) //выгрузить обработаный файл в указаную папку
});
*/
gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
});

gulp.task('css-libs', ['sass'], function(){
	return gulp.src([
		'app/css/libs.css'
		])
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'))
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlagins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'))
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload)
	gulp.watch('app/js/**/*.js', browserSync.reload)
});

gulp.task('build', ['clean','sass','scripts','img'],function(){
	var buildCss = gulp.src([
		'app/css/libs.min.css',
		'app/css/main.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src([
		'app/fonts/**/*'
		])
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src([
		'app/js/**/*'
		])
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src([
		'app/*.html'
		])
	.pipe(gulp.dest('dist'))
});