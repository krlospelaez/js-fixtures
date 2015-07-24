"use strict";
(function(fixtures){
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // NodeJS
        module.exports = fixtures;
    } else if (typeof define === 'function' && define.amd){
        define(function(){
            return fixtures;
        });
    } else{
        var global = (false || eval)('this');
        global.fixtures = fixtures;
    }

}(new function(){
        var fixturesCache = {};
        var self = this;

        self.breakpoints = {
            "desktop": {
                width: 1366,
                height: 768
            },
            "tablet-portrait": {
                width: 768,
                height: 1024
            },
            "tablet-landscape": {
                width: 1024,
                height: 768
            },
            "mobile-portrait": {
                width: 375,
                height: 667
            },
            "mobile-landscape": {
                width: 667,
                height: 375
            }
        };
        self.containerId = 'js-fixtures';
        self.path = 'spec/javascripts/fixtures';

        // set default breakpoint to dekstop
        self.screenWidth = self.breakpoints.desktop.width;
        self.screenHeight = self.breakpoints.desktop.height;
        self.setScreenSize = function (width, height) {
            self.screenWidth = width;
            self.screenHeight = height;
        };
        self.setBreakpoint = function(breakpoint) {
            if(self.breakpoints[breakpoint]) {
                self.setScreenSize(self.breakpoints[breakpoint].width, self.breakpoints[breakpoint].height);
                return true;
            }
            return false;
        };
        self.window = function(){
            var iframe = document.getElementById(self.containerId);
            if (!iframe) return null;

            return iframe.contentWindow || iframe.contentDocument; 
        };
        self.body = function(){
            if (!self.window()) return null;

            var content = self.window().document.body.innerHTML;
            return content; 
        };
        self.load = function(html){
            var cb = typeof arguments[arguments.length - 1] === 'function' ? arguments[arguments.length -1] : null;
            addToContainer(self.read.apply(self, arguments), cb);
        };
        self.injectScript = function(path, callback) {
            var scripts = document.getElementsByTagName('script'),
                head, src;

            //If the given path is not an URL
            // We get the Url from the parent included scripts
            if(path.indexOf('/') === -1) {

                for (var i = 0; i < scripts.length; i++) {
                    src = scripts[i].getAttribute('src');

                    if (src && src.indexOf(path) !== -1) {
                        path = src;
                        break;
                    }
                }
            }

            var doc = self.window().document;
            head = doc.getElementsByTagName('head')[0];

            var script = doc.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = callback;
            script.src = path;
            head.appendChild(script);

        };
        self.set = function(html){
            addToContainer(html);
        };
        self.cache = function(){
            self.read.apply(self, arguments);
        };
        self.sandbox = function(obj){
            addToContainer(objToHTML(obj));
        };
        self.read = function(){
            var htmlChunks = '';

            Array.prototype.slice.call(arguments, 0).forEach(function(argument){
                if (typeof argument === 'string') htmlChunks += getFixtureHtml(argument);
            });
            return htmlChunks;
        };
        self.clearCache = function(){
            fixturesCache = {};
        };
        self.cleanUp = function(){
            var iframe = document.getElementById(self.containerId);
            if(!iframe) return null;

            iframe.parentNode.removeChild(iframe);
        };
        var createContainer  = function(html){
            var cb = typeof arguments[arguments.length - 1] === 'function' ? arguments[arguments.length -1] : null;
            var iframe = document.createElement('iframe');
            iframe.setAttribute('id', self.containerId);
            iframe.style.opacity = 0;
            iframe.style.filter = 'alpha(0)';
            iframe.style.width = self.screenWidth + 'px';
            iframe.style.height = self.screenHeight + 'px';

            document.body.appendChild(iframe);
            var doc = iframe.contentWindow || iframe.contentDocument;
            doc = doc.document ? doc.document : doc;

            if (cb){
                var iframeReady = setInterval(function(){
                    if (doc.readyState === 'complete'){
                        clearInterval(iframeReady);
                        cb();
                    }
                }, 0);
            }

            doc.open();
            doc.defaultView.onerror = captureErrors;
            doc.write(html);
            doc.close();
        };
        var addToContainer = function(html, cb){
            var container = document.getElementById(self.containerId);
            if (!container) createContainer.apply(self, arguments);
            else self.window().document.body.innerHTML += html;
        };
        var captureErrors = function(){
            if (window.onerror){
                // Rewrite the message prefix to indicate that the error
                // occurred in the fixture.
                arguments[0] = arguments[0].replace(/^[^:]*/, "Uncaught fixture error");
                window.onerror.apply(window, arguments);
            }
            return true;
        };
        var getFixtureHtml = function(url){
            if (typeof fixturesCache[url] === 'undefined'){
                loadFixtureIntoCache(url);
            }
            return fixturesCache[url];
        };
        var loadFixtureIntoCache = function(relativeUrl){
            var url = makeFixtureUrl(relativeUrl);
            var request = new XMLHttpRequest();
            var sep = url.indexOf('?') === -1 ? '?' : '&';
            request.open('GET', url + sep + new Date().getTime(), false);
            request.send(null);
            fixturesCache[relativeUrl] = request.responseText;
        };
        var makeFixtureUrl = function(relativeUrl){
            return self.path.match('/$') ? self.path + relativeUrl : self.path + '/' + relativeUrl;
        };
        var objToHTML = function(obj){
            var divElem = document.createElement('div'); 
            for (var key in obj){
                if (key === 'class'){ // IE < 9 compatibility
                    divElem.className = obj[key];
                    continue;
                }
                divElem.setAttribute(key, obj[key]);
            }
            return divElem.outerHTML;
        };
    }
));
