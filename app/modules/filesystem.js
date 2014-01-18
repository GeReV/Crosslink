define([
  "use!underscore",
  "modules/commands"
], function(_, TerminalCommands) {
    
    var files = {
        boot: {
            
        },
        usr: {
            bin: {

            }
        }
    };
    
    var FileSystem = function (files) {
        this.files = files;
        this.path = [];

        this.init();
    };

    _.extend(FileSystem.prototype, {
        init: function() {
            this.constructFileTree(this.files);
        },
        constructFileTree: function(files) {
            /*_.each(files, function(value, key) {
                if (typeof value === 'object') {
                    value['..'] = value;
                }

                this.constructFileTree(value);
            }, this);*/
        },
        join: function(sep) {
            sep = sep || '/';

            return (sep + this.path.join(sep) + sep).replace(sep + sep, sep);
        },
        directory: function() {
            var dir = this.files;

            _.each(this.path, function(p) {
                if (p in dir) {
                    dir = dir[p];
                }
            });

            return dir;
        },
        ls: function(args) {
            var result = '';

            this.cd(args);

            return _.map(this.directory(), function(value, key) {
                return key + (typeof value === 'object' ? '/' : '');
            }).join('\n');
        },
        pwd: function() {
            return this.join();
        },
        cd: function(args) {
            if (!args.length) {
                return;
            }

            var dest = _.compact(args[0].split('/'));

            try {
                _.each(dest, function(d) {
                    if (d === '..') {
                        this.path.pop();
                    } else if (d in this.directory()) {
                        this.path.push(d);
                    }else{
                        throw 'Unknown directory: ' + this.join() + dest.join('/');
                    }
                }, this);
            }catch(e) {
                return e;
            }
        }
    });

    var fileSystem = new FileSystem(files);

    _.extend(TerminalCommands, {
        ls: {
            man: 'List files and directories in current path.',
            fn: function (terminal, args, out) {
                return fileSystem.ls(args);
            }
        },
        pwd: {
            man: 'Display current path.',
            fn: function (terminal, args, out) {
                return fileSystem.pwd();
            }
        },
        cd: {
            man: 'Change path.',
            fn: function (terminal, args, out) {
                var result = fileSystem.cd(args)

                terminal.updatePrompt(fileSystem.join());

                return result;
            }
        }
    });

    return fileSystem;
});