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
    
    templates: {
      deps: ["handlebars"]
    }
  }
});
