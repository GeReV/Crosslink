// Set the require.javascript configuration for your application.
require.config({
  // Initialize the application with the main application file
  deps: ["main"],

  paths: {
    // JavaScript folders
    libs: "../assets/javascript/libs",
    plugins: "../assets/javascript/plugins",

    // Libraries
    jquery: "../assets/javascript/libs/jquery",
    jqueryui: "../assets/javascript/libs/jquery-ui",
    underscore: "../assets/javascript/libs/underscore",
    backbone: "../assets/javascript/libs/backbone",
    layoutmanager: "../assets/javascript/libs/backbone.layoutmanager",

    // Shim Plugin
    use: "../assets/javascript/plugins/use"
  },

  use: {
    jqueryui: {
      deps: ["jquery"]
    },
    
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },
    
    layoutmanager: {
    	deps: ["use!backbone"]
    },

    underscore: {
      attach: "_"
    }
  }
});
