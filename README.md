# Sortable Grid

## How To Use

### Prepare your HTML

Add `class="sortable"` to each column header `<th/>` that should you wish to make sortable.

```html
<table id="my-table">
    <caption>My Table</caption>
    <thead>
        <tr>
            <th scope="col" class="sortable">Column One</th>
            <th scope="col" class="sortable">Column Two</th>
            <th scope="col" class="sortable">Column Three</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>column one data</td>
            <td>column two data</td>
            <td>column three data</td>
        </tr>
        <!-- etc. -->
    </tbody>
</table>
```

### Invoke Sortable-Grid on your table

#### Option 1: *With* jQuery

In your HTML, include the jQuery plugin script:

```html
<script src="sortable-grid.jquery.js"></script>
```

In your JavaScript, invoke `$.fn.sortableGrid()`:

```js
$('#my-table').sortableGrid();
```

#### Option 2: *Without* jQuery

In your HTML, include the script:

```html
<script src="sortable-grid.js"></script>
```

In your JavaScript, instantiate a new `SortableGrid#`:

```js
var table = document.querySelector('#my-table');
new SortableGrid(table);
```

## Viewing the Demo

Requires [nodejs](http://nodejs.org)

```bash
$ git clone https://github.com/schne324/sortable-grid.git
```

Then open `demo/index.html` in your browser.

## Rebuilding the Plugin

Requires [nodejs](http://nodejs.org)

If you wish to modify the plugin, make your changes to `src/index.js`. If you wish to modify the demo, make your changes to `demo/index.jade`.

In either case, when you are finished, rebuild by running:

```bash
$ npm run build
```
