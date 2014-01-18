define([
  // Libs
  "jquery",
  "underscore",
  "backbone",
  "marionette"
],

function($, _, Backbone, Marionette) {
  // Put application wide code here

  return {
    app: new Marionette.Application()
  };
});
