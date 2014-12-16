
/**
 * Module dependencies.
 */

var Duo = require('duo');
var jade = require('jade');
var fs = require('fs');

var demoHtml = jade.renderFile('demo.jade', {
  filename: 'demo.jade',
  pretty: true
});

fs.writeFile('demo.html', demoHtml, function (err) {
  if (err) throw err;
});

new Duo(__dirname)
.entry('index.js')
.copy(true)
.global('SortableGrid')
.run(function (err, src) {
  if (err) throw err;

  fs.writeFile('sortable-grid.js', src, function (err) {
    if (err) throw err;
  });

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
