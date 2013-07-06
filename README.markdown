The code was completely refactored from the awesome jasmine-jquery with all jasmine and jquery dependencies removed, specs written with Chai + Mocha, and using an iframe implementation as a sandbox.  This allows the fixtures to be more portable and minimizes side effects with the test runner.

## Fixtures

Fixture module allows you to load HTML content to be used by your tests.
    
By default, fixtures are loaded from `spec/javascripts/fixtures`. You can configure this path: `fixtures.path = 'my/new/path';`.

Your fixture is being loaded into an iframe container that is automatically added to the DOM (If you _REALLY_ must change id of this container, try: `fixtures.containerId = 'my-new-id';` in your test runner). To make tests fully independent, make sure to clean up after your fixtures with `fixtures.cleanUp`. Also, fixtures are internally cached, so you can load the same fixture file in several tests without penalty to your test suite's speed.
    
Several methods for loading fixtures are provided:

- `load(fixtureUrl[, fixtureUrl, ...])`
  - Loads fixture(s) from one or more files and automatically appends them to the DOM (to the fixtures container).
- `appendLoad(fixtureUrl[, fixtureUrl, ...])`
  - Same as load, but adds the fixtures to the pre-existing fixture container.
- `read(fixtureUrl[, fixtureUrl, ...])`
  - Loads fixture(s) from one or more files but instead of appending them to the DOM returns them as a string (useful if you want to process fixture's content directly in your test).
- `set(html)`
  - Doesn't load fixture from file, but instead gets it directly as a parameter. Automatically appends fixture to the DOM (to the fixtures container). It is useful if your fixture is too simple to keep it in an external file or is constructed procedurally, but you still want Fixture module to automatically handle DOM insertion and clean-up between tests for you.
- `appendSet(html)`
  - Same as set, but adds the fixtures to the pre-existing fixture container.
- `preload(fixtureUrl[, fixtureUrl, ...])`
  - Pre-loads fixture(s) from one or more files and stores them into cache, without returning them or appending them to the DOM. All subsequent calls to `load` or `read` methods will then get fixtures content from cache, without making any AJAX calls (unless cache is manually purged by using `clearCache` method). Pre-loading all fixtures before a test suite is run may be useful when working with libraries like jasmine-ajax that block or otherwise modify the inner workings of JS or jQuery AJAX calls.
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

## Installation

Install with npm using `npm install js-fixtures` and include the fixtures.js file in your browser (or just download the raw from github).

You may also load it using AMD.

## Usage

Use `fixtures.load('your-fixture.html')` in your specs instead of `jasmine.fixtures.loadFixture('your-fixture.html')`

Clean up fixtures with `fixtures.cleanUp` (perhaps in a `afterEach()` block)

## Gotchas (if you're used to jasmine-jquery)

-  `set` and `appendSet` methods do not accept jQuery

## Executing Tests
Do an `npm install` to grab the test dependencies.  Then point your browser to the index.html file.

## Cross domain policy problems under Chrome

Newer versions of Chrome don't allow file:// URIs read other file:// URIs. In effect, js-fixtures cannot properly load fixtures under some versions of Chrome. An override for this is to run Chrome with a switch `--allow-file-access-from-files`.  Another way is to ensure that you are executing the test runner under a web server.
