define([
  "underscore"
],
function(_) {
  var TerminalCommands = {
    echo: {
      man: 'Echoes the supplied text.',
      fn: function(terminal, args, out) {
        return args.length ? args.join(' ') : out;
      }
    },
    
    grep: {
      man: 'Search plain text input for patterns matching a supplied regular expression.',
      fn: function(terminal, args, out) {
        var result = out, search, regex, match, i, l;
        
        search = out || '';
        if (args.length >= 2) {
          search = args.slice(1).join(' ');
        }
        
        if (args.length) {
          try {
            regex = new RegExp(args[0]);
          } catch (e) {
            regex = /.+/;
          }

          search = search.split(/\r?\n/);
          result = [];

          _.each(search, function (row) {
            if (regex.test(row)) {
              result.push(row);
            }
          });
          
          result = result.join('\n');
        }
        
        //terminal.printLine(result);
        
        return result;
      }
    },
    
    help: {
      man: 'Prints a list of available commands.',
      fn: function (terminal, args) {
        var result = '';

        if (args.length && this[ args[0] ]) {
          //terminal.printLine(this[args[0]].man);

          result = this[args[0]].man;
        }else{
          _(this).each(function(value, key) {            
            //terminal.printLine('<span class="command">' + key + '</span>: ' + value.man);

            result += key + ': ' + value.man + '\n';
          });
        }

        return result;
      }
    }
  };
  
  return TerminalCommands;
});