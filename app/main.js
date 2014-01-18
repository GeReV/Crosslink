require([
  "namespace",
  
  // Libs
  "jquery",
  "backbone",
  "marionette",
  "handlebars",

  // Modules
  "modules/application",
  
  "jqueryui",
  
  "templates"
],

function(namespace, $, Backbone, Marionette, Handlebars, Application) {
  
  Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(template) {
    return Handlebars.templates[template];
  };
  
  Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(template) {
    return template;
  };

  // Shorthand the application namespace
  var app = namespace.app;
  
  app.Layout = Backbone.Marionette.Layout.extend({
    template: 'main',

    regions: {
      desktop: '#desktop',
      taskbar: 'footer'
    }
  });
  
  app.addRegions({
    main: '#main'
  });
  
  app.addInitializer(function() {

    app.layout = new app.Layout();

    app.main.show(app.layout);
    
  });
  
  app.addInitializer(function() {
    var Application = app.module('Application');
    
    app.layout.taskbar.show(new Application.Views.Menu());
  });


  // Treat the jQuery ready function as the entry point to the application.
  // Inside this function, kick-off all initialization, everything up to this
  // point should be definitions.
  $(function() {
    
    app.start();
    
    /*var win = new Application.Views.TerminalWindow();
      
    main.view('#desktop', win, true);*/
  });

});
