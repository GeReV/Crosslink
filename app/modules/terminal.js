define([
  // Libs
  "jquery",
  "use!underscore",
  "use!backbone",

  // Modules
  "modules/commands"

  // Plugins
], function($, _, Backbone, TerminalCommands) {

  var Terminal = function(el) {
    this.el = el;
    this.$el = $(el);

    this.path = '/';
    
    this.updatePrompt();
    
    this.caret = '&#9608;';
    this.caretIndex = 0;
    this.caretState = false;
    
    this.buffer = '';
    this.lastCommandBuffer = '';
    
    this.history = [];
    this.historyIndex = -1;
    
    this.initialize();
  };
  
  _.extend(Terminal.prototype, {
    initialize: function() {
      this.caretBlink = setInterval(_.bind(function() {          
        this.caretState = !this.caretState;
        this.updateDisplay();
      }, this), 1000);
      
      this.renderPrompt();
      
      this.cur = this.$('.cur');
      
      $(document).on({
        'keypress': _.bind(this.keypress, this),
        'keydown': _.bind(this.keydown, this)
      });
    },
    
    $: function(selector) {
      return this.$el.find(selector);
    },

    updatePrompt: function(path) {
        this.path = path || this.path;
        
        this.prompt = '<span class="username">root</span>@<span class="machine">machine</span>:' + this.path + '$ ';
    
        this.messagePrompt = [
          'Login as: <span class="username">root</span><br />',
          this.prompt,
          '<span class="cur"></span>'
        ].join('\n');
    },
    
    renderPrompt: function() {
      this.$el.append(this.messagePrompt);
    },
    
    keypress: function(e) {
      var character, letter;
      
      if (e.which >= 32 && e.which <= 126) {
        character = String.fromCharCode(e.which);
        letter = e.shiftKey ? character : character.toLowerCase();
      }
      
      if (character) {
        this.buffer = this.buffer.slice(0, this.caretIndex) + letter + this.buffer.slice(this.caretIndex);
        this.caretIndex++;
      }
      
      this.updateDisplay();
      
      e.preventDefault();
    },
    
    keydown: function(e) {
      if (e.which == 8) {
        this.buffer = this.buffer.slice(0, this.caretIndex - 1) + this.buffer.slice(this.caretIndex);
        this.caretIndex = Math.max(0, this.caretIndex - 1);
        
        e.preventDefault();
      }
      
      if (e.which == 46) {
        this.buffer = this.buffer.slice(0, this.caretIndex) + this.buffer.slice(this.caretIndex + 1);
      }
      
      if (e.which == 13) {
        this.runCommand();
        this.printLine(this.prompt, true);
      }
      
      if (e.which == 35) { // End
        this.caretState = true;
        this.caretIndex = this.buffer.length;
      }
      
      if (e.which == 36) { // Home
        this.caretState = true;
        this.caretIndex = 0;
      }
      
      if (e.which == 37) { // Left
        this.caretState = true;
        this.caretIndex = Math.max(0, this.caretIndex - 1);
      }
      
      if (e.which == 38) { // Up
        this.moveHistory(1);
      }
      
      if (e.which == 39) { // Right
        this.caretState = true;
        this.caretIndex = Math.min(this.buffer.length, this.caretIndex + 1);
      }
      
      if (e.which == 40) { // Down
        this.moveHistory(-1);
      }
      
      this.updateDisplay();
    },
    
    updateDisplay: function() {
      var displayBuffer = this.buffer;
      
      if (this.caretState) {
        displayBuffer = displayBuffer.slice(0, this.caretIndex) + this.caret + displayBuffer.slice(this.caretIndex + 1);
      }
      
      this.cur.html(displayBuffer.replace(/\s/g, '&nbsp;'));
    },
    
    printLine: function(line, nobr) {
      line = (line || '').replace(/\r?\n/g, '<br />');
      
      this.cur.before(line);
      
      !nobr && this.cur.before('<br />');
      
      this.cur.empty();
    },
    
    moveHistory: function(direction) {
      if (this.historyIndex == -1) {
        this.lastCommandBuffer = this.buffer;
      }
      
      this.historyIndex = Math.max(-1, Math.min(this.historyIndex + direction, this.history.length));
      
      if (this.historyIndex >= 0 && this.historyIndex < this.history.length) {
        this.buffer = this.history[ this.historyIndex ];
      }else if (this.historyIndex < 0) {
        this.buffer = this.lastCommandBuffer;
      }else {
        this.buffer = '';
      }
      
      this.caretIndex = this.buffer.length;
    },
    
    runCommand: function(line) {
      var line = this.ltrim(this.rtrim(line || this.buffer)), commands, i, l, command, args, out;
      
      this.printLine(this.buffer.replace(/\s/g, '&nbsp;'));
      
      if (line == '') {
        return;
      }
      
      this.history.unshift( this.buffer );
      
      this.lastCommandBuffer = this.buffer = '';
      this.historyIndex = -1;
      this.caretIndex = 0;
      
      commands = this.parseCommand(line);
      
      for (i = 0, l = commands.length; i < l; i++) {
        command = commands[i][0];
        args = commands[i][1];
        
        if ( TerminalCommands[command] ) {
          out = TerminalCommands[command].fn.call(TerminalCommands, this, args || [], out);
        }else{
          this.printLine('Unknown command: <span class="command">' + command + '</span>');
          return;
        }
      }

      if (out) {
        this.printLine(out);
      }
    },
    
    parseCommand: function(command) {
      var commands = command.replace(/\|+/g, '|').split('|'), ltrim = this.ltrim, rtrim = this.rtrim;
      
      commands = _(commands).map(function(command) {
          command = ltrim(rtrim(command.replace(/\s+/g, ' '))).split(' ');
          
          if (command.length > 1) {
            return [ command[0], command.slice(1) ];
          }
          
          return command;
        });
      
      return commands;
    },
    
    ltrim: function(s) {
      s = s || '';
      return s.replace(/\s*((\S+\s*)*)/, '$1');
    },
    
    rtrim: function(s) {
      s = s || '';
      return s.replace(/((\s*\S+)*)\s*/, '$1');
    }
  });

  return Terminal;
});