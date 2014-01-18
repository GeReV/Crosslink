var port = process.env.PORT || 3000,
    http = require('http'),
    express = require('express'),
    scss = require('node-sass'),

    config = require('./config.json'),

    app = express(),
    server = http.createServer(app);

app.set('view engine', 'hbs');

//app.use(express.logger());

app.use(express.compress());

app.use(express.methodOverride());

app.use(express.cookieParser());

app.use(express.session({
  secret: config.secret,
  key: config.session_key
}));

app.use(scss.middleware({
  src: __dirname,
  dest: __dirname,
  debug: true,
  outputStyle: 'compressed'
}));

app.configure(function(){
  var dir     = __dirname + "/app/templates"
      output  = __dirname + "/public/templates.js",
      hbsPrecompiler = require('handlebars-precompiler');
  
  hbsPrecompiler.watchDir(dir, output, ['handlebars', 'hbs']);
  
  hbsPrecompiler.do({
    templates: [dir],
    output: output,
    fileRegex: /\.handlebars$|\.hbs$/i,
    min: true
  });
  
});

app.use(express.static(__dirname));

server.listen(port);

console.log('Express :: Listening on port ' + port);
