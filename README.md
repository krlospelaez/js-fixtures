## Fixtures

The fixtures module allows you to load HTML content to be used by your tests.

Your fixture is being loaded into an iframe container that is automatically added to the DOM.  Fixtures are internally cached, so you can load the same fixture file in several tests without penalty to your test suite's speed.

The code was completely refactored from the awesome jasmine-jquery with all jasmine and jquery dependencies removed, specs written with Chai + Mocha, and using an iframe implementation as a sandbox.  This allows the fixtures to be more portable and minimizes side effects with the test runner.

## Installation

```
npm install js-fixtures // if you use npm
bower install fixtures // or if you prefer bower
```

then within your test runner:

```
<script src="fixtures.js"></script>

// or if you prefer AMD:
define(['fixtures'], function(fixtures){
  ...
})
```

## Usage

Use `fixtures.load('your-fixture.html')` in your specs.  Fixtures will load from `/specs/javascript/your-fixture.html` (see below to change this path).

Clean up fixtures with `fixtures.cleanUp` (perhaps in a `afterEach()` block)

## Documentation

Several methods for loading fixtures are provided:

- `load(fixtureUrl[, fixtureUrl, ...])`
  - Loads fixture(s) from one or more files and automatically appends them to the DOM (to the fixtures container).  Subsequent calls to `load` performs an automatic clean up.
- `appendLoad(fixtureUrl[, fixtureUrl, ...])`
  - Same as load, but adds the fixtures to the pre-existing fixture container.
- `read(fixtureUrl[, fixtureUrl, ...])`
  - Loads fixture(s) from one or more files but instead of appending them to the DOM returns them as a string (useful if you want to process fixture's content directly in your test).
- `set(html)`
  - Loads html markup directly without specifying a path
- `appendSet(html)`
  - Same as set, but adds the fixtures to the pre-existing fixture container
- `preload(fixtureUrl[, fixtureUrl, ...])`
  - Pre-loads fixture(s) from one or more files and stores them into cache, without returning them or appending them to the DOM. All subsequent calls to `load` or `read` methods will then get fixtures content from cache, without making any AJAX calls (unless cache is manually purged by using `clearCache` method).
- `sandbox(jsObject)`
  - Creates a quick fixture from the js object you provide (ex. `sandbox({id: 'foo-fixture', class: 'cool'})` )

Additionally, two clean up methods are provided:

- `clearCache()`
  - purges Fixture module internal cache (you should need it only in very special cases; typically, if you need to use it, it may indicate a smell in your test code)
- `cleanUp()`
  - cleans-up fixtures container

Finally, there are two convenience properties to access the contents of the sandboxed iframe:
- `body`
  - returns the html contents of the body.  Use it to assert various values on the body of the iframe DOM.
- `window`
  - returns the global window reference of the iframe, giving you the ability to use the global variables injected into that context.
  
Options:
- `fixtures.containerId`
  - change the ID of the iframe that gets injected into the page
- `fixtures.path`
 - change the path to look for fixtures (default: `spec/javascripts/fixtures`)

## Executing Tests
Do an `npm install` to grab the test dependencies.  Then point your browser to the test/index.html file.

## Cross domain policy problems under Chrome

Newer versions of Chrome don't allow file:// URIs read other file:// URIs. In effect, js-fixtures cannot properly load fixtures under some versions of Chrome. An override for this is to run Chrome with a switch `--allow-file-access-from-files`.  Another way is to ensure that you are executing the test runner under a web server.
