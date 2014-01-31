(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['planetary', 'd3'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('planetary'), require('d3'));
  }
}(this, function(planetaryjs, d3) {
  'use strict';

  planetaryjs.plugins.nodes = function(config) {
      var nodes = [];
      config = config || {};
  
      var addNode = function(lng, lat, options) {
        options = options || {};
        options.color = options.color || config.color || 'white';
        options.edges = options.edges || config.edges || 6;
        var node = { options: options };
        if (config.latitudeFirst) {
          node.lat = lng;
          node.lng = lat;
        } else {
          node.lng = lng;
          node.lat = lat;
        }
        nodes.push(node);
      };
  
      var drawNodes = function(planet, context) {
        var newNodes = [];
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
  
          newNodes.push(node);
          drawNode(planet, context, node);
        }
        nodes = newNodes;
      };
  
      var drawNode = function(planet, context, node) {
        var color = d3.rgb(node.options.color);
        var alpha = 255;
        color = "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
        context.fillStyle = color;
        var circle = d3.geo.circle().origin([node.lng, node.lat])
          .precision(360 / node.options.edges)
          .angle(1.5)();
        context.beginPath();
        planet.path.context(context)(circle);
        context.fill();
      };
  
      return function (planet) {
        planet.plugins.nodes = {
          add: addNode
        };
  
        planet.onDraw(function() {
          planet.withSavedContext(function(context) {
            drawNodes(planet, context);
          });
        });
      };
    };
}));