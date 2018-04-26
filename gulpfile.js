var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var build = require('gulp-build');

var rename = require('gulp-rename');
var rollup = require('gulp-better-rollup');
var babel = require('rollup-plugin-babel');

/* var gulp               = require('gulp'),
    gutil              = require('gulp-util'),
    rollup             = require('rollup').rollup,
    babelRollup        = require('rollup-plugin-babel'),
    eslintRollup       = require('rollup-plugin-eslint'),
    uglifyRollup       = require('rollup-plugin-uglify'),
    rollupProgress     = require('rollup-plugin-progress'),
    beep               = require('beepbeep'); */
	
/* 	Setup includes these rollupjs plugins:
rollup (basic rollupjs bundler)
rollup-plugin-babel (converts ES2015 code to ES5 or earlier, for legacy browsers support)
rollup-plugin-eslint (verify the javascript code is valid)
rollup-plugin-uglify (minify the code, to make it smaller)
rollup-plugin-progress (shows bundle progress in terminal. shows which file being "worked on")
beepbeep (Make a console beep sound. I use this to inform me of compilaction errors) */

gulp.task('sass1', function() {
  return gulp.src('./app/sass/main.sass') 
    .pipe(sass())
    .pipe(gulp.dest('./app1'));
});

  
gulp.task('scripts', function() {
  return gulp.src(['./app/js/consts.js', './app/js/controller.js', './app/js/index.js', './app/js/model.js', './app/js/utils.js', './app/js/view.js'])  
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

 
 
gulp.task('build', function() {
  gulp.src('./app/js/*.js')
      .pipe(build({ GA_ID: 'my' }))
      .pipe(gulp.dest('dist'))
});


 /* взял и сократил с https://www.npmjs.com/package/gulp-better-rollup */
 
gulp.task('lib-build', () => {
  gulp.src(['./app/js/model.js', './app/js/consts.js',   './app/js/utils.js' , './app/js/viewMovingModule.js',  './app/js/view.js', './app/js/controller.js'])
      .pipe(rollup({
        plugins: [babel()]
    }, {
        format: 'cjs',
    }))
      .pipe(gulp.dest('dist'))
})