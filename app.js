(function() {
  
  // set up
  var express = require('express');
  var app = express();
  var http = require('http');
  var mongoose = require('mongoose');
  var methodOverride = require('method-override');
  var bodyParser = require('body-parser');
  var uid = require('uid2');
  var upload = require('jquery-file-upload-middleware');

  // configure
  mongoose.connect('mongodb://test:test@ds027318.mongolab.com:27318/mindsoil');

  app.use(express.static(__dirname + '/public'));                 // set the static files location
  app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
  app.use(bodyParser.json());                                     // parse application/json
  app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
  app.use(methodOverride());

  // image upload configuration
  /*uploadimg.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/api/upload/image'
  });
  app.use('/api/upload/image', uploadimg.fileHandler());*/
  app.use('/api/upload/media', function (request, response, next) {
    upload.fileHandler({
      uploadDir: function () {
        return __dirname + '/public/uploads/' + request.fields.uid;
      },
      uploadUrl: function () {
        return '/uploads/' + request.fields.uid;
      }
    })(request, response, next);
  });
  upload.on('begin', function (fileInfo, request, response) {
    //console.log(fileInfo.type);
    var ext = fileInfo.name.substr(fileInfo.name.lastIndexOf('.') + 1);
    fileInfo.name = request.fields.type + '.' + ext;
  });

  // define model
  var projectSchema = new mongoose.Schema({
    uid: String,
    name: String,
    urlname: String,
    title: String,
    blurb: String,
    objective: String,
    solution: String,
    show: Boolean,
    home: Boolean,
    imagefull: String,
    imagecropped: String,
    imagemobile: String,
    videos: Array
  });
  var Project = mongoose.model('Project', projectSchema);

  // api
  // get all projects
  app.get('/api/projects', function(request, response) {
    Project.find(function(err, projects) {
      if (err) {
        response.send(err);
      }
      response.json(projects);
    });
  });

  // generate unique id
  app.get('/api/projects/uid', function(request, response) {
    var uniqueID = uid(18);
    response.send(uniqueID);
  });

  // add project
  app.post('/api/projects', function(request, response) {
    //console.log(request.body);
    Project.create({
      uid: request.body.uid,
      name: request.body.name,
      urlname: space2dash(request.body.name),
      title: request.body.title,
      blurb: request.body.blurb,
      objective: request.body.objective,
      solution: request.body.solution,
      show: false,
      home: false,
      imagefull: request.body.imagefull,
      imagecropped: request.body.imagecropped,
      imagemobile: request.body.imagemobile,
      videos: []
    }, function(err, project) {
      if (err) {
        response.send(err);
      }
      response.send(project.urlname);
    });
  });

  // get individual project
  app.get('/api/projects/:project_name', function(request, response) {
    Project.findOne({
      urlname: request.params.project_name
    }, function(err, project) {
      if (err) {
        response.send(err);
      }
      response.json(project);
    });
  });

  // update project
  app.put('/api/projects/:project_name', function(request, response) {
    Project.findOneAndUpdate(
      { urlname: request.params.project_name },
      { uid: request.body.uid,
        name: request.body.name,
        urlname: space2dash(request.body.name),
        title: request.body.title,
        blurb: request.body.blurb,
        objective: request.body.objective,
        solution: request.body.solution,
        imagefull: request.body.imagefull,
        imagecropped: request.body.imagecropped,
        imagemobile: request.body.imagemobile,
        videos: [] },
      function(err, project) {
        if (err) {
          response.send(err);
        }
        response.send(space2dash(request.body.name));
      });
  });

  // show display of project
  app.put('/api/projects/:project_name/show', function(request, response) {
    Project.findOneAndUpdate(
      { urlname: request.params.project_name },
      { show: true },
      function(err, project) {
        if (err) {
          response.send(err);
        }
        response.json(project);
      });
  });

  // hide display of project
  app.put('/api/projects/:project_name/hide', function(request, response) {
    Project.findOneAndUpdate(
      { urlname: request.params.project_name },
      { show: false,
        home: false },
      function(err, project) {
        if (err) {
          response.send(err);
        }
        response.json(project);
      });
  });

  // show project on home
  app.put('/api/projects/:project_name/home', function(request, response) {
    Project.findOneAndUpdate(
      { urlname: request.params.project_name },
      { home: true },
      function(err, project) {
        if (err) {
          response.send(err);
        }
        response.json(project);
      });
  });

  // hide project on home
  app.put('/api/projects/:project_name/nothome', function(request, response) {
    Project.findOneAndUpdate(
      { urlname: request.params.project_name },
      { home: false },
      function(err, project) {
        if (err) {
          response.send(err);
        }
        response.json(project);
      });
  });

  // main
  app.get('/*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
  });

  // admin
  app.get('/admin*', function(request, response) {
    response.sendFile(__dirname + '/public/admin/index.html');
  });

  /*
  app.get('/', function(request, response) {
    response.send('Home page');
  });

  app.get('/admin', function(request, response) {

  });

  */

  var space2dash = function(text) {
    return text.replace(/\s/g,'-');
  };

  var dash2space = function(text) {
    return text.replace(/\-/g,' ');
  };

  // listen
  app.listen(5000, function() {
    console.log('Running Express on 5000');
  });

})();