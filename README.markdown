## Fixtures

Fixture module allows you to load HTML content to be used by your tests. The overall workflow is like follows:

In _myfixture.html_ file:

    <div id="my-fixture">some complex content here</div>
    
Inside your test:

    fixtures.load('myfixture.html');
    $('#my-fixture').myTestedPlugin();
    expect($('#my-fixture')).to...;
    
By default, fixtures are loaded from `spec/javascripts/fixtures`. You can configure this path: `fixtures.fixturesPath = 'my/new/path';`.

Your fixture is being loaded into `<div id="fixtures"></div>` container that is automatically added to the DOM by the Fixture module (If you _REALLY_ must change id of this container, try: `fixtures.containerId = 'my-new-id';` in your test runner). To make tests fully independent, make sure to clean up after your fixtures with `fixtures.cleanUp`. Also, fixtures are internally cached by the Fixture module, so you can load the same fixture file in several tests without penalty to your test suite's speed.
    
Several methods for loading fixtures are provided:

- `load(fixtureUrl[, fixtureUrl, ...])`
  - Loads fixture(s) from one or more files and automatically appends them to the DOM (to the fixtures container).
- `appendLoad(fixtureUrl[, fixtureUrl, ...])`
  - Same as load, but adds the fixtures to the pre-existing fixture container.
- `read(fixtureUrl[, fixtureUrl, ...])`
  - Loads fixture(s) from one or more files but instead of appending them to the DOM returns them as a string (useful if you want to process fixture's content directly in your test).
- `set(html)`
  - Doesn't load fixture from file, but instead gets it directly as a parameter (html parameter may be a string or a jQuery element, so both `set('<div></div>')` and `set($('<div/>'))` will work). Automatically appends fixture to the DOM (to the fixtures container). It is useful if your fixture is too simple to keep it in an external file or is constructed procedurally, but you still want Fixture module to automatically handle DOM insertion and clean-up between tests for you.
- `appendSet(html)
  - Same as set, but adds the fixtures to the pre-existing fixture container.
- `preload(fixtureUrl[, fixtureUrl, ...])`
  - Pre-loads fixture(s) from one or more files and stores them into cache, without returning them or appending them to the DOM. All subsequent calls to `load` or `read` methods will then get fixtures content from cache, without making any AJAX calls (unless cache is manually purged by using `clearCache` method). Pre-loading all fixtures before a test suite is run may be useful when working with libraries like jasmine-ajax that block or otherwise modify the inner workings of JS or jQuery AJAX calls.

Also, a helper method for creating HTML elements for your tests is provided:

- `sandbox([{attributeName: value[, attributeName: value, ...]}])`

It creates an empty DIV element with a default id="sandbox". If a hash of attributes is provided, they will be set for this DIV tag. If a hash of attributes contains id attribute it will override the default value. Custom attributes can also be set. So e.g.:

    sandbox();
    
Will return:

    <div id="sandbox"></div>    
    
And:

    sandbox({
      id: 'my-id',
      class: 'my-class',
      myattr: 'my-attr'
    });
    
Will return:

    <div id="my-id" class="my-class" myattr="my-attr"></div>

Sandbox method is useful if you want to quickly create simple fixtures in your tests without polluting them with HTML strings:

    setFixtures(sandbox({class: 'my-class'}));
    $('#sandbox').myTestedClassRemoverPlugin();
    expect($('#sandbox')).not.toHaveClass('my-class');

This method also has a global short cut available:

- `sandbox([{attributeName: value[, attributeName: value, ...]}])`

Additionally, two clean up methods are provided:

- `clearCache()`
  - purges Fixture module internal cache (you should need it only in very special cases; typically, if you need to use it, it may indicate a smell in your test code)
- `cleanUp()`
  - cleans-up fixtures container
  
These two methods do not have global short cut functions.

## Cross domain policy problems under Chrome

Newer versions of Chrome don't allow file:// URIs read other file:// URIs. In effect, jasmine-jquery cannot properly load fixtures under some versions of Chrome. An override for this is to run Chrome with a switch `--allow-file-access-from-files` (I have not verified if this works for all Chrome versions though). The full discussion on this topic can be found in [this GitHub ticket](https://github.com/velesin/jasmine-jquery/issues/4).
