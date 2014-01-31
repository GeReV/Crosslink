// Set the require.javascript configuration for your application.
require.config({
  baseURL: "../assets/javascript",
  
  // Initialize the application with the main application file
  deps: ["main"],

  paths: {
    // Libraries
    jquery: "../assets/javascript/libs/jquery",
    jqueryui: "../assets/javascript/libs/jquery-ui",
    underscore: "../assets/javascript/libs/underscore",
    backbone: "../assets/javascript/libs/backbone",
    marionette: "../assets/javascript/libs/backbone.marionette",
    handlebars: "../assets/javascript/libs/handlebars",
    d3: "../assets/javascript/libs/d3.v3",
    topojson: "../assets/javascript/libs/topojson",
    planetary: "../assets/javascript/libs/planetaryjs",
    "planetaryjs.nodes": "../assets/javascript/libs/planetaryjs.nodes",
    templates: "../public/templates"
  },

  shim: {
    jqueryui: {
      deps: ["jquery"]
    },

    underscore: {
      exports: "_"
    },
    
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    
    marionette: {
      deps: ["backbone"],
      exports: "Backbone.Marionette"
    },
    
    handlebars: {
      exports: "Handlebars"
    },
    
    planetary: {
      deps: ["d3"]
    },
    
    templates: {
      deps: ["handlebars"]
    }
  }
});
