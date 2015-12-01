
/**
 * Dependencies.
 */

var jade = require('gulp-jade');
var path = require('path');
var gulp = require('gulp');
var Duo = require('duo');
var fs = require('fs');

/**
 * Constants.
 */

var DEMO_DIR = 'demo';
var SRC_DIR = 'src';

/**
 * Default task.
 */

gulp.task('default', ['demo', 'script']);

/**
 * Renders the demo markup.
 */

gulp.task('demo', function () {
  gulp.src(path.join(DEMO_DIR, 'index.jade'))
    .pipe(jade())
    .pipe(gulp.dest(DEMO_DIR));
});

/**
 * Builds the JS and jQuery versions of the module.
 */

gulp.task('script', function (done) {
  Duo(__dirname)
    .entry(path.join(SRC_DIR, 'index.js'))
    .copy(true)
    .global('SortableGrid')
    .run(function (err, src) {
      if (err) throw err;

      var str = src.code;

      /**
       * Write sortable-grid as standard js component.
       */

      fs.writeFileSync('sortable-grid.js', str);

      /**
       * Write sortable-grid as jQuery plugin.
       */

      var jqSrc = [
        '$.fn.sortableGrid = function () {\n',
        str,
        'new SortableGrid(this[0]);\n',
        'return this;\n',
        '};\n',
      ].join('\n');

      fs.writeFileSync('sortable-grid.jquery.js', jqSrc);

      done();
    });
});
