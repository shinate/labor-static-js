var fs = require('fs');
var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var cssConcat = require('gulp-concat-css');
var clean = require('gulp-clean');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var version = require('gulp-version-number');
var htmlReplace = require('gulp-html-replace');
var connect = require('gulp-connect');
var amdClean = require('amdclean');
var rjs = require('requirejs');
var Q = require('q');
var path = require('path');

var CONF = {
    src: './src',
    dist: './dist',
    tmp: './tmp',
    package: './package',
    unit: './unit',
    amd: './amd',
    public: './public',
    unit_options: {
        namespace: 'window'
    }
};

gulp.task('unit', function () {
    gulp.src(CONF.src + '/**/*.js')
        .pipe(function(){

        })
        .pipe(gulp.dest(CONF.package))
});

gulp.task('default', function () {

});