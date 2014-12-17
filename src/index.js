
/**
 * Module dependencies.
 */

var events = require('component/events');
var closest = require('component/closest');
var classes = require('component/classes');
var dataset = require('code42day/dataset');
var empty = require('yields/empty');
// Use 3.4.2 of ded/qwery for IE8 support
var qwery = require('ded/qwery@v3.4.2');

var DESCENDING = 'descending';
var ASCENDING = 'ascending';

module.exports = SortableGrid;

/**
 * Creates a new instance of `SortableGrid`.
 *
 * @param {HTMLElement} el
 * @param {Object} opts
 * @return {SortableGrid}
 * @api public
 */

function SortableGrid(el, opts) {
  if (!(this instanceof SortableGrid))
    return new SortableGrid(el, opts || {});
  // TODO Use these opts for something
  opts = opts || {};

  this.el = el;
  this.headers = qwery('.sortable', el);
  this.tbody = qwery('tbody', el)[0];
  this.rows = qwery('tr', this.tbody);
  this.addIcons();
  this.events = events(this.el, this);
  this.events.bind('keydown .sortable', 'triggerClick');
  this.events.bind('click .sortable', 'sortCol');
}

/**
 * Adds default icon to all sortable headers
 * to indicate their interactive nature.
 *
 * @api private
 */

SortableGrid.prototype.addIcons = function () {
  this.headers.forEach(function (th) {
    var icon = document.createElement('i');
    icon.className = 'fa fa-sort';
    th.appendChild(icon);
  });
};

/**
 * Trigger a click event on an event target
 * if Enter or Space was pressed.
 *
 * @param {KeyboardEvent} e
 * @api private
 */

SortableGrid.prototype.triggerClick = function (e) {
  if (~[13, 32].indexOf(e.which)) {
    e.target.click();
  }
};

/**
 * Perform the sort. Remove all rows from tbody
 * and reinsert rows in the selected order.
 *
 * @param {ClickEvent} e
 * @return {SortableGrid}
 * @api public
 */

SortableGrid.prototype.sortCol = function (e) {
  var header = closest(e.target, 'th', true);
  var order = this.toggleHeader(header);
  var sortType = dataset(header, 'sort');
  var index = this.headers.indexOf(header);
  var self = this;
  var items = [];

  this.rows.forEach(function (tr) {
    var item = {};
    item.tr = tr;
    var td = qwery('td', tr)[index];
    // TODO Allow user to configure what element
    //      within the cell is parsed for sorting.
    item.val = td.textContent; // IE9+
    items.push(item);
  });

  if (!sortType || sortType === 'standard') {
    items.sort(compare);
  }
  else if (sortType === 'num') {
    items.sort(compareNum);
  }
  else if (sortType === 'date') {
    items.sort(compareDate);
  }

  empty(this.tbody);

  items.forEach(function (item) {
    self.tbody.appendChild(item.tr);
  });

  return this;

  function compare(a, b) {
    return (order === ASCENDING)
      ? a.val > b.val
      : a.val < b.val;
  }

  function compareNum(a, b) {
    return (order === ASCENDING)
      ? parseInt(a.val) > parseInt(b.val)
      : parseInt(a.val) < parseInt(b.val);
  }

  function compareDate(a, b) {
    return (order === ASCENDING)
      ? unixTime(a.val) > unixTime(b.val)
      : unixTime(a.val) < unixTime(b.val);
  }
};

/**
 * Toggles the sorted state of a column header.
 *
 * Uses the current sorted state to determine
 * the intended state, and returns the new state.
 *
 * @param {HTMLElement} th
 * @return {String} ['descending'|'ascending']
 * @api private
 */

SortableGrid.prototype.toggleHeader = function (th) {
  var state = ASCENDING;
  var headerClasses = classes(th);
  var icon = qwery('i', th)[0];

  // Descending -> Ascending
  if (headerClasses.contains(DESCENDING)) {
    state = ASCENDING;
    headerClasses
    .remove(DESCENDING)
    .add(ASCENDING);
    icon.className = 'fa fa-sort-asc';
  }
  // Ascending -> Descending
  else if (headerClasses.contains(ASCENDING)) {
    state = DESCENDING;
    headerClasses
    .remove(ASCENDING)
    .add(DESCENDING);
    icon.className = 'fa fa-sort-desc';
  }
  else {
    headerClasses.add(ASCENDING);
    icon.className = 'fa fa-sort-asc';
  }

  // Update all other col headers with the neutral sort icon
  this.headers.forEach(function (el) {
    if (el == th) return;
    classes(el)
    .remove(ASCENDING)
    .remove(DESCENDING);
    var icon = qwery('i', el)[0];
    icon.className = 'fa fa-sort';
  });

  return state;
};

/**
 * Converts common date strings to unixtime.
 * Useful in Array#sort compare functions.
 *
 * @param {String} dateString
 * @return {Number}
 * @api private
 */

function unixTime(dateString) {
  return new Date(dateString).getTime();
}
