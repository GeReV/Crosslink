require([
  "namespace",

  // Libs
  "jquery",
  "use!backbone",

  // Modules
  "modules/application",
  
  "use!jqueryui"
],

function(namespace, $, Backbone, Application) {

  Backbone.LayoutManager.configure({
    fetch: function(path) {
      path = path + ".html";

      var done = this.async();
      var JST = window.JST = window.JST || {};

      // Should be an instant synchronous way of getting the template, if it
      // exists in the JST object.
      if (JST[path]) {
        return done(JST[path]);
      }

      // Fetch it asynchronously if not available from JST
      $.get(path, function(contents) {
        var tmpl = _.template(contents);

        JST[path] = tmpl;
        done(tmpl);
      });
    },
    
    render: function(template, context) {
      return template(context);
    }
  });

  // Shorthand the application namespace
  var app = namespace.app;
  
  app.covers = (function() {
    var holder = $('.covers');
    
    return {
      full: holder.find('.full'),
      left: holder.find('.left'),
      right: holder.find('.right'),
      
      show: function(el) {
        holder.addClass('visible').children().removeClass('visible');
        el.addClass('visible');
      },
      hide: function(el) {
        holder.removeClass('visible');
        
        if (el) {
          el.removeClass('visible');
        }else{
          holder.children().removeClass('visible');
        }
      }
    };
  })();

  // Treat the jQuery ready function as the entry point to the application.
  // Inside this function, kick-off all initialization, everything up to this
  // point should be definitions.
  $(function() {
    
    var main = namespace.app.layout = new Backbone.LayoutManager({
      template: 'app/templates/main',
    });
    
    main.$el.appendTo('#main');
    
    main.render();
    
    var win = new Application.Views.TerminalWindow();
      
    main.view('#desktop', win, true);
    
    main.view('footer', new Application.Views.Menu);
    
    main.render();
  });

});
