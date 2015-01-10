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
    gulp.watch(['src/*.js', 'test/*.js'], ['js','lint','test']);
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
    'bower_components/angular-scenario/browserTrigger.js',
    //'bower_components/angular-scenario/matchers.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/**/*.js',
    'test/**/*.js'
  ],
  reporters: ['progress'],//, 'brackets'],
  frameworks: ['jasmine'],
  autoWatch: true,
  browsers: [
    //'Chrome',
    'PhantomJS'
  ],
  colors :  false
  //singleRun: false,
};

function karmaExit(exitCode) {
  var exec = require('child_process').exec;
  //gutil.log('XXXXX Karma has exited with ' + exitCode);
  exec('taskkill /im phantomjs.exe',function() {
    console.log('phantomjs.exe is killed');
  });
  //process.exit(exitCode);
}

gulp.task('tdd', function (done) {
  karma.server.start(karmaCommonConf, done); //karmaExit);
//  karma.server.start({
//    configFile: __dirname + '/karma.conf.js'
//  }, done);
});

gulp.task('test', function (done) {
  karmaCommonConf.singleRun = true;
  karma.runner.run(karmaCommonConf, done);
//  karma.runner.run({
//    configFile: __dirname + '/karma.conf.js'
//  }, done);
});

gulp.task('stop', function (done) {
  var exec = require('child_process').exec;
  //gutil.log('bbb Karma has exited );
  exec('taskkill /im phantomjs.exe',function() {
    console.log('phantomjs.exe is killed');
  });
  process.exit(1);
});

//taskkill /f /im notepad.exe
//taskkill /im notepad.exe
//exec("taskkill /PID "+pid+(force==true?' /f':''),callback);
//phantomjs.exe
