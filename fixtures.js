"use strict";
var fixtures = fixtures || new function(){
    var fixturesCache = {};
    var self = this;

    self.containerId = 'fixtures';
    self.fixturesPath = 'spec/javascripts/fixtures';
    self.set = function(html){
        self.cleanUp();
        addToContainer(html)
    };
    self.appendSet = function(html){
        addToContainer(html);
    };
    self.preload = function(){
        self.read.apply(self, arguments);
    };
    self.load = function(){
        self.cleanUp();
        createContainer(self.read.apply(self, arguments));
    };
    self.appendLoad = function(){
        addToContainer(self.read.apply(self, arguments));
    };
    self.read = function(){
        var htmlChunks = [];

        var fixtureUrls = arguments;
        for (var urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++){
            htmlChunks.push(getFixtureHtml(fixtureUrls[urlIndex]));
        }
        return htmlChunks.join('');
    };
    self.clearCache = function(){
        fixturesCache = {};
    };
    self.cleanUp = function(){
        jQuery('#' + self.containerId).remove();
    };
    self.sandbox = function(attributes){
      var attributesToSet = attributes || {};
      return jQuery('<div id="sandbox" />').attr(attributesToSet);
    };
    var createContainer  = function(html){
        var container;
        if(html instanceof jQuery){
            container = jQuery('<div id="' + self.containerId + '" />');
            container.html(html);
        } else{
            container = '<div id="' + self.containerId + '">' + html + '</div>'
        }
        jQuery('body').append(container);
    };
    var addToContainer = function(html){
        var container = jQuery('body').find('#' + self.containerId).append(html);
        if (!container.length){
            createContainer(html);
        }
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
        request.open("GET", url + "?" + new Date().getTime(), false);
        request.send(null);
        fixturesCache[relativeUrl] = request.responseText;
    };
    var makeFixtureUrl = function(relativeUrl){
        return self.fixturesPath.match('/$') ? self.fixturesPath + relativeUrl : self.fixturesPath + '/' + relativeUrl;
    };
};
