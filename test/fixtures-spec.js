describe("fixtures.Fixtures", function(){
    var ajaxData = "some ajax data";
    var fixtureUrl = "some_url";
    var anotherFixtureUrl = "another_url";
    var server = sinon.fakeServer.create();;
    var fixturesContainer = function(){
        return $('#' + fixtures.containerId);
    };
    var appendFixturesContainerToDom = function(){
        $('body').append('<div id="' + fixtures.containerId + '">old content</div>');
    };
    beforeEach(function(){
        server = sinon.fakeServer.create();
        server.respondWith(ajaxData);
        server.autoRespondAfter = 1;
    });
    afterEach(function(){
        server.restore();
        fixtures.clearCache();
        $('#fixtures').remove();
    });

    describe("default initial config values", function(){
        it("should set 'fixtures-fixtures' as the default container id", function(){
            fixtures.containerId.should.equal('fixtures');
        });
        it("should set 'spec/javascripts/fixtures/' as the default fixtures path", function(){
            fixtures.fixturesPath.should.equal('spec/javascripts/fixtures');
        });
    });
    describe("read", function(){
        it("should return fixture HTML", function(){
            var html = fixtures.read(fixtureUrl);

            html.should.equal(ajaxData);
        });
        it("should return duplicated HTML of a fixture when its url is provided twice in a single call", function(){
            var html = fixtures.read(fixtureUrl, fixtureUrl);
            html.should.equal(ajaxData + ajaxData);
        });
        it("should return merged HTML of two fixtures when two different urls are provided in a single call", function(){
            var html = fixtures.read(fixtureUrl, anotherFixtureUrl);
            html.should.equal(ajaxData + ajaxData);
        });
        it("should use the configured fixtures path concatenating it to the requested url (without concatenating a slash if it already has an ending one)", function(){
            fixtures.fixturesPath = 'a path ending with slash'
            fixtures.read(fixtureUrl);
            server.requests[0].url.should.have.string('a path ending with slash/' + fixtureUrl);
        });
        it("should use the configured fixtures path concatening it to the requested url (concatenating a slash if it doesn't have an ending one)", function(){
            fixtures.fixturesPath = "a path without an ending slash"
            fixtures.read(fixtureUrl);
            server.requests[0].url.should.have.string("a path without an ending slash/" + fixtureUrl);
        });
    });
    describe("load", function(){
        it("should insert fixture HTML into container", function(){
            fixtures.load(fixtureUrl);
            fixturesContainer().html().should.equal(ajaxData);
        });
        it("should insert duplicated fixture HTML into container when the same url is provided twice in a single call", function(){
            fixtures.load(fixtureUrl, fixtureUrl);
            fixturesContainer().html().should.equal(ajaxData + ajaxData);
        });
        it("should insert merged HTML of two fixtures into container when two different urls are provided in a single call", function(){
            fixtures.load(fixtureUrl, anotherFixtureUrl);
            fixturesContainer().html().should.equal(ajaxData + ajaxData);
        });
        describe("when fixture container does not exist", function(){
            it("should automatically create fixtures container and append it to the DOM", function(){
                fixtures.load(fixtureUrl);
                fixturesContainer().size().should.equal(1);
            });
        });
        describe("when fixture container exists", function(){
            beforeEach(function(){
                appendFixturesContainerToDom();
            });
            it("should replace it with new content", function(){
                fixtures.load(fixtureUrl);
                fixturesContainer().html().should.equal(ajaxData);
            });
        });
        describe("when fixture contains an inline &lt;script&gt; tag", function(){
            beforeEach(function(){
                ajaxData = "<div><a id=\"anchor_01\"></a><script>$(function(){$('#anchor_01').addClass('foo')});</script></div>"
                server.respondWith(ajaxData);
            });
            it("should execute the inline javascript after the fixture has been inserted into the body", function(){
                fixtures.load(fixtureUrl);
                $("#anchor_01").should.have.class('foo');
            });
        });
    });
    describe("appendLoad", function(){
        beforeEach(function(){
            ajaxData = 'some ajax data';
            server.respondWith(ajaxData);
        });
        it("should insert fixture HTML into container", function(){
            fixtures.appendLoad(fixtureUrl);
            fixturesContainer().html().should.equal(ajaxData);
        });
        it("should insert duplicated fixture html into container when the same url is provided twice in a single call", function(){
            fixtures.appendLoad(fixtureUrl, anotherFixtureUrl);
            fixturesContainer().html().should.equal(ajaxData + ajaxData);
        });
        it("should insert merged HTML of two fixtures into container when two different urls are provided in a single call", function(){
            fixtures.appendLoad(fixtureUrl, anotherFixtureUrl);
            fixturesContainer().html().should.equal(ajaxData + ajaxData);
        });
        it("should automatically create fixtures container and append it to the DOM", function(){
            fixtures.appendLoad(fixtureUrl);
            fixturesContainer().size().should.equal(1);
        });
        describe("with a prexisting fixture",function(){
            beforeEach(function() {
                fixtures.appendLoad(fixtureUrl);
            });

            it("should add new content", function() {
                fixtures.appendLoad(fixtureUrl);
                fixturesContainer().html().should.equal(ajaxData + ajaxData);
            });

            it("should not add a new fixture container", function(){
                fixtures.appendLoad(fixtureUrl);
                fixturesContainer().size().should.equal(1);
            });
        });
        describe("when fixture contains an inline &lt;script&gt; tag", function(){
            beforeEach(function(){
                ajaxData = "<div><a id=\"anchor_01\"></a><script>$(function(){ $('#anchor_01').addClass('foo')});</script></div>"
                server.respondWith(ajaxData);
            });

            it("should execute the inline javascript after the fixture has been inserted into the body", function(){
                fixtures.appendLoad(fixtureUrl);
                $("#anchor_01").should.have.class('foo');
            })
        });
    });
    describe("preload", function() {
        describe("read after preload", function() {
            it("should go from cache", function() {
                fixtures.preload(fixtureUrl, anotherFixtureUrl);
                fixtures.read(fixtureUrl, anotherFixtureUrl);
                server.requests.length.should.equal(2);
            })

            it("should return correct HTMLs", function() {
                fixtures.preload(fixtureUrl, anotherFixtureUrl);
                var html = fixtures.read(fixtureUrl, anotherFixtureUrl);
                html.should.equal(ajaxData + ajaxData);
            });
        });

        it("should not preload the same fixture twice", function() {
            fixtures.preload(fixtureUrl, fixtureUrl);
            server.requests.length.should.equal(1);
        });
    });

    describe("set", function() {
        var html = '<div>some HTML</div>';

        it("should insert HTML into container", function() {
            fixtures.set(html);
            fixturesContainer().html().should.equal(html);
        });

        it("should insert jQuery element into container", function() {
            fixtures.set($(html));
            fixturesContainer().html().should.equal(html);
        });

        describe("when fixture container does not exist", function() {
            it("should automatically create fixtures container and append it to DOM", function() {
                fixtures.set(html);
                fixturesContainer().size().should.equal(1);
            });
        });

        describe("when fixture container exists", function() {
            beforeEach(function() {
                appendFixturesContainerToDom();
            });

            it("should replace it with new content", function() {
                fixtures.set(html);
                fixturesContainer().html().should.equal(html);
            });
        });
    });

    describe("appendSet",function(){ 
        var html = '<div>some HTML</div>';
        it("should insert HTML into container", function() {
            fixtures.appendSet(html);
            fixturesContainer().html().should.equal(html);
        });

        it("should insert jQuery element into container", function() {
            fixtures.appendSet($(html));
            fixturesContainer().html().should.equal(html);
        });

        describe("when fixture container does not exist", function() {
            it("should automatically create fixtures container and append it to DOM", function() {
                fixtures.appendSet(html);
                fixturesContainer().size().should.equal(1);
            });
        });

        describe("when fixture container exists", function() {
            beforeEach(function() {
                fixtures.appendSet(html);
            });

            it("should add new content", function() {
                fixtures.appendSet(html);
                fixturesContainer().html().should.equal(html+html);
            });
        });
    });

    describe("sandbox", function() {
        describe("with no attributes parameter specified", function() {
            it("should create DIV with id #sandbox", function() {
                fixtures.sandbox().html().should.equal($('<div id="sandbox" />').html());
            });
        });

        describe("with attributes parameter specified", function() {
            it("should create DIV with attributes", function() {
                var attributes = {
                    attr1: 'attr1 value',
                attr2: 'attr2 value'
                };
                var element = $(fixtures.sandbox(attributes));

                element.attr('attr1').should.equal(attributes.attr1);
                element.attr('attr2').should.equal(attributes.attr2);
            });

            it("should be able to override id by setting it as attribute", function() {
                var idOverride = 'overridden';
                var element = $(fixtures.sandbox({id: idOverride}));
                element.attr('id').should.equal(idOverride);
            });
        });
    });

    describe("cleanUp", function() {
        it("should remove fixtures container from DOM", function() {
            appendFixturesContainerToDom();
            fixtures.cleanUp();
            fixturesContainer().size().should.equal(0);
        });
    });
});

describe("fixtures.Fixtures using real AJAX call", function() {
    var defaultFixturesPath;

    beforeEach(function() {
        defaultFixturesPath = fixtures.fixturesPath;
        fixtures.fixturesPath = 'spec/fixtures';
    });

    afterEach(function() {
        fixtures.fixturesPath = defaultFixturesPath;
    });

    describe("when fixture file exists", function() {
        it("should load content of fixture file", function() {
           var fixtureUrl = "real_non_mocked_fixture.html";
           var fixtureContent = fixtures.read(fixtureUrl);
           fixtureContent.should.equal('<div id="real_non_mocked_fixture"></div>');
        });
    });
});
