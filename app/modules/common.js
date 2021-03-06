define([
  "namespace",

  // Libs
  "jquery",
  "backbone",
  "marionette",

  // Modules
  "modules/filesystem",
  "modules/terminal",

  // Plugins
  "jqueryui"
],

function(namespace, $, Backbone, Marionette, FileSystem, Terminal) {

  // Create a new module
  var Common = namespace.app.module("Common", function(Common) {
    
    Common.Views = {};
    
    Common.Views.Menu = Marionette.ItemView.extend({
      template: 'menu',
  
      tagName: 'menu',
  
      events: {
        'click #terminal': 'terminal'
      },
      
      terminal: function() {
        console.log('Terminal');
        
        namespace.app.layout.desktop.attachView(new Common.Views.TerminalWindow());
      }
    });
  
    // This will fetch the tutorial template and render it.
    Common.Views.Window = Marionette.ItemView.extend({
      template: "window",
      
      className: 'window',
      
      title: 'Window',
      
      serialize: function() {
        return { title: this.title };
      },
      
      events: {
        'click .close': 'close'
      },
      
      ui: {
        content: '.content'
      },
  
      onShow: function() {
          var app = namespace.app;
          
          $(this.el).resizable({
            containment: '#desktop',
            handles: 'all',
            minWidth: 320,
            minHeight: 150
          });
          
          $(this.el).draggable({
            handle: 'header',
            containment: '#main',
            snap: '.window, #desktop',
            snapMode: 'both',
            snapTolerance: 10,
            /*start: function(e, ui) {
              $el.removeClass('full left right').css('position', 'relative');
            },
            drag: function(e, ui) {
              var el;
              
              if (ui.offset.left === 0) {
                el = app.covers.left;
              }else if (ui.offset.left + $el.outerWidth() >= main.width()) {
                el = app.covers.right;
              }else if (ui.offset.top === 0) {
                el = app.covers.full;
              }
              
              if (el) {
                app.covers.show(el);
              }else{
                app.covers.hide();
              }
            },
            stop: function(e, ui) {
              function setLocation(location) {
                $el.removeClass('full left right').addClass(location).css({
                  top: '',
                  left: '',
                  position: ''
                });
                
                namespace.app.covers.hide();
              }
              
              if (ui.offset.left === 0) {
                setLocation('left');
              }else if (ui.offset.left + $el.outerWidth() >= main.width()) {
                setLocation('right');
              }else if (ui.offset.top === 0) {
                setLocation('full');
              }
            }*/
          });
      }
    });
    
    Common.Views.TerminalWindow = Common.Views.Window.extend({
      className: 'window terminal ui-widget-content',
      
      title: 'Terminal',
      
      onShow: function(manage) {
        Common.Views.Window.prototype.onShow.call(this);
        
        
        this.terminal = new Terminal( this.ui.content.get(0) );
      }
    });
  });

  // Required, return the module for AMD compliance
  return Common;

});
