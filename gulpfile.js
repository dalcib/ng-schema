'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require('gulp-rename'),
    insert = require('gulp-insert'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    karma = require('karma');


//var pkg = require('./package.json'),
var prepend = '(function () { \n\n',
    append = '})();';

gutil.log = function() { return this;};

gulp.task('js', function () {
    return gulp.src('src/**/*.js')
        //.pipe(insert.wrap(prepend, append))
        .pipe(concat('ng-schema.js', {newLine: '\n\n'}))
        .pipe(insert.wrap(prepend, append))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(rename('ng-schema.min.js'))
        .pipe(gulp.dest('build'))
        .on('error', gutil.log);
});

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('lint', function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint('.jshintrc'))
        // .pipe(jshint('gulp.jshintrc'))
        .pipe(jshint.reporter('default'))
        .on('error', gutil.log);
});


gulp.task('watch', function () {
    gulp.watch(['src/*.js', 'test/*.js'], ['js','lint'/*,'test'*/]);
});

/*gulp.task('watch:build', function () {
    gulp.watch('src/*.js', ['clean', 'build']);
});*/

gulp.task('default', ['js']);
gulp.task('brackets-default', ['js']);

//gulp.task('brackets-onsave', ['test']);

var karmaCommonConf = {
  basePath : '.',
  files : [
    'bower_components/angular/angular.js',
    //'bower_components/angular-scenario/browserTrigger.js',
    //'bower_components/angular-scenario/matchers.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/**/*.js',
    'test/**/*.js'
  ],
  reporters: [/*'progress',*/ 'dots'],//, 'brackets'],
  frameworks: ['jasmine'],
  autoWatch: true,
  browsers: [
    //'Chrome',
    'PhantomJS'
  ],
  colors :  true
  //singleRun: false,
};

gulp.task('tdd', function (done) {
  karma.server.start(karmaCommonConf, done);
});

gulp.task('test', function (done) {
  karmaCommonConf.singleRun = true;
  karma.runner.run(karmaCommonConf, done);
});



gulp.task('start', ['tdd', 'watch']);

module.exports = gulp;
