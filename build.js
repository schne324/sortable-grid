
/**
 * Module dependencies.
 */

var Duo = require('duo');
var jade = require('jade');
var fs = require('fs');

/**
 * Render the demo page.
 */

var demoHtml = jade.renderFile('demo/index.jade', {
  filename: 'demo/index.jade',
  pretty: true
});

fs.writeFile('demo/index.html', demoHtml, function (err) {
  if (err) throw err;
});

/**
 * Build sortable-grid script.
 */

new Duo(__dirname)
.entry('src/index.js')
.copy(true)
.global('SortableGrid')
.run(function (err, src) {
  if (err) throw err;

  /**
   * Write sortable-grid as standard js component.
   */

  fs.writeFile('sortable-grid.js', src, function (err) {
    if (err) throw err;
  });

  /**
   * Write sortable-grid as jQuery plugin.
   */

  var jqSrc = [
    '$.fn.sortableGrid = function () {\n',
    src,
    'new SortableGrid(this[0]);\n',
    'return this;\n',
    '};\n',
  ].join('\n');

  fs.writeFile('sortable-grid.jquery.js', jqSrc, function (err) {
    if (err) throw err;
  });

});
