var argv = require('yargs').argv,
  gulpif = require('gulp-if'),
  gulp = require('gulp'),
  babel = require('gulp-babel'),
  browserify = require('browserify'),
  chalk = require('chalk'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  fileinclude = require('gulp-file-include'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  inject = require('gulp-inject'),
  source = require('vinyl-source-stream'),
  plumber = require('gulp-plumber'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  livereload = require('gulp-livereload');


// ---------------------------------------
// Utilities
// ---------------------------------------
const handleError = function (error) {
  console.log(chalk.blue('ERROR') + " : " + chalk.bgRed(error.message));
  this.emit('end');
}

// ---------------------------------------
// Paths
// ---------------------------------------
var paths = {
  scss: [
    'src/assets/**/*.scss',
    'src/assets/**/*.css'
  ],
  scripts: [
    'src/assets/**/*.js'
  ],
  dest: './public'
}

// ---------------------------------------
// Styles
// ---------------------------------------
gulp.task('scss', function () {
  gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat('app.css'))
    .pipe(gulpif(argv.production, cleanCSS()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest + '/css/'))
    .pipe(livereload());
});

// ---------------------------------------
// Scripts
// ---------------------------------------
gulp.task('scripts', function () {
  return browserify({
      entries: './src/assets/scripts/app.js',
      debug: true
    })

    .transform("babelify", {
      presets: ["es2015"]
    })
    .bundle()
    .on('error', handleError)
    .pipe(source('app.js'))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/scripts'))
    .pipe(livereload());
});

// ---------------------------------------
// Watch
// ---------------------------------------
gulp.task('watch', ['scss', 'scripts'], function () {
  livereload.listen();

  gulp.watch(paths.scss, ['scss']);
  gulp.watch(paths.scripts, ['scripts']);
});

// ---------------------------------------
// Build
// ---------------------------------------
// Run `gulp build --production` in
// order to minify (uglify) the JS for deployment
gulp.task('build', ['scss', 'scripts']);