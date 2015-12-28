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
var HM = require('head-master');
var through = require('through-gulp');

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

    var hm = new HM({
        baseDir: CONF.src
    });

    return gulp.src([CONF.src + '/**/*.js'])
        .pipe(through.map(function (n) {
            n.contents = new Buffer(hm.pack(
                path.relative(n.base, path.join(path.dirname(n.history[0]), path.basename(n.history[0], '.js'))), {
                    uglify: false,
                    type: 1
                }
            ));
            return n;
        }))
        .pipe(gulp.dest(CONF.dist));
});

gulp.task('default', function () {

});