const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const minify = require('gulp-minify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const header = require('gulp-header');
const package = require('./package.json');
const cleancss = require('gulp-clean-css');

const banner = {
	full: "/*!\n" +
		" * <%= package.name %> v<%= package.version %>\n" +
		" * <%= package.description %>\n" +
		" * (c) " + new Date().getFullYear() + " <%= package.author.name %>\n" +
		" * <%= package.license %> License\n" +
		" * <%= package.repository.url %>\n" +
		" */\n\n",
	min: "/*!" +
		" <%= package.name %> v<%= package.version %>" +
		" | (c) " + new Date().getFullYear() + " <%= package.author.name %>" +
		" | <%= package.license %> License" +
		" | <%= package.repository.url %>" +
		" */\n\n"
};

// source and build 
const source = {
	'script': 'source/script/*.js',
	'style': 'source/style/*.scss'
};

const build = {
	'js': 'build/js/',
	'css': 'build/css/'
};

// build JS
gulp.task('build-js', function () {
	return gulp.src(source.script)
		.pipe(plumber())
		.pipe(babel({
			presets: [
				['@babel/env', {
					modules: false
				}]
			]
		}))
		.pipe(minify({
			ext: {
				min: '.min.js'
			}
		}))
		.pipe(header(banner.min, {
			package: package
		}))
		.pipe(gulp.dest(build.js))
});

// build SCSS
gulp.task('build-sass', function () {
	return gulp.src(source.style)
		.pipe(sass())
		.pipe(postcss([autoprefixer]))
		.pipe(header(banner.min, {
			package: package
		}))
		.pipe(gulp.dest(build.css))
		.pipe(cleancss())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(build.css))
});

// Watch
gulp.task('watch', function () {
	gulp.watch(source.style, gulp.series('build-sass'))
	gulp.watch(source.script, gulp.series('build-js'))
});

// build Default
gulp.task('default', gulp.series('build-sass', 'build-js'));