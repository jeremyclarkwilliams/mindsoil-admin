/*global angular:true */
(function() {

  angular.module('AdminApp', ['ngRoute'])

  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    // remove hash from url
    $locationProvider.html5Mode(true);

    // routes
    $routeProvider.when('/', {
      templateUrl: '/templates/admin/listings/index.html',
      controller: 'ProjectListingController'
    }).when('/project', {
      templateUrl: '/templates/admin/project-form/index.html',
      controller: 'ProjectAddController'
    }).when('/project/:name', {
      templateUrl: '/templates/admin/project-form/index.html',
      controller: 'ProjectEditController'
    });

  }])

  // list projects
  .controller('ProjectListingController', ['$scope', '$http', function($scope, $http) {

    // get all projects
    $http.get('/api/projects').success(function(data) {
        $scope.projects = data;
      }).error(function(data) {
        console.log('Error: ' + data);
      });

    // toggle display of project on site
    $scope.toggleDisplay = function() {
      var project = this.project;
      if (project.show) {
        $http.put('/api/projects/' + project.urlname + '/hide').success(function(data) {
          project.show = false;
          project.home = false; // if project doesn't display, toggle home off
        }).error(function(data) {
          console.log('Error: ' + data);
        });
      } else {
        $http.put('/api/projects/' + project.urlname + '/show').success(function(data) {
          project.show = true;
        }).error(function(data) {
          console.log('Error: ' + data);
        });
      }
    };

    // toggle display of project on home page
    $scope.toggleHome = function() {
      var project = this.project;
      if (project.home) {
        $http.put('/api/projects/' + project.urlname + '/nothome').success(function(data) {
          project.home = false;
        }).error(function(data) {
          console.log('Error: ' + data);
        });
      } else if (project.show) { // only toggle home if project is also set to display
        $http.put('/api/projects/' + project.urlname + '/home').success(function(data) {
          project.home = true;
        }).error(function(data) {
          console.log('Error: ' + data);
        });
      }
    };

  }])

  // add new project
  .controller('ProjectAddController', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.project = {};

    // generate unique id
    $http.get('/api/projects/uid').success(function(data) {
        $scope.project.uid = data;
      }).error(function(data) {
        console.log('Error: ' + data);
      });

    // check entered name against existing names
    $scope.checkName = function() {
      var urlname = space2dash($scope.project.name);
      $http.get('/api/projects/' + urlname).success(function(data) {
        if (typeof data !== undefined && null !== data) { // project name already exists
          $scope.projectform.name.$setValidity('uniqueName',false);
        } else { // project name doesn't exist
          $scope.projectform.name.$setValidity('uniqueName',true);
        }
      }).error(function(data) {
        console.log('Error: ' + data);
      });
    };

    // save project and redirect to project edit page
    $scope.saveProject = function() {
      $http.post('/api/projects', $scope.project).success(function(data) {
        //console.log('Success: ' + data);
        var projectUrlName = data;
        $location.path('/project/' + projectUrlName);
      }).error(function(data) {
        console.log('Error: ' + data);
      });
    };

    // save project and redirect to admin panel
    $scope.saveAndReturn = function() {
      $http.post('/api/projects', $scope.project).success(function(data) {
        $location.path('/');
      }).error(function(data) {
        console.log('Error: ' + data);
      });
    };

    // trigger media file input with fake button
    $('.media-input .add-btn, .media-input .file-field').on('click', function() {
      $(this).parent().find('input[type=file]').click();
    });
    $('.media-input input[type=file]').change(function() {
      var filename = $(this).val().split('fakepath\\')[1],
          fieldname = $(this).siblings('.file-field').attr('name');
      $(this).siblings('.file-field').val(filename);
      $scope.$apply(function() {
        if (fieldname === 'imagefilefake') {
          $scope.projectform.imagefilefake.value = filename;
        } else if (fieldname === 'videofilefake') {
          $scope.projectform.videofilefake.value = filename;
        }
      });
    });

    // image upload
    $('#image-input input[type=file]').fileupload({
      dataType: 'json',
      url: '/api/upload/media',
      add: function (e, data) {
        $('#image-input .upload-btn').click(function() {
          if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(data.files[0].name)) {
            $scope.project.imagefull = '';
            $('#image-input .progress').css('display', 'inline-block');
            data.formData = {uid: $scope.project.uid, type: 'image'};
            data.submit();
          } else {
            $('#image-input .message').addClass('error').text('Wrong file format.');
          }
        });
      },
      progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#image-input .progress .bar').css('width', progress + '%');
      },
      done: function (e, data) {
        var filename = data.result.files[0].name;
        $('#image-input .progress').hide();
        $('#image-input .file-field').val('');
        $scope.$apply(function() {
          $scope.projectform.imagefilefake.value = '';
          $scope.project.imagefull = '/uploads/' + $scope.project.uid + '/' + filename + '?' + new Date().getTime();
          $scope.project.imagecropped = '/uploads/' + $scope.project.uid + '/' + filename;
          $scope.project.imagemobile = '/uploads/' + $scope.project.uid + '/' + filename;
        });
      }
    });

  }])

  // edit existing project
  .controller('ProjectEditController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {

    $scope.project = {};

    if (typeof $routeParams.name !== undefined) {
      $http.get('/api/projects/' + $routeParams.name).success(function(data) {
          console.log(data);
          $scope.project = data;
        }).error(function(data) {
          console.log('Error: ' + data);
        });
    }

    $scope.checkName = function() {
      var urlname = space2dash($scope.project.name);
      $http.get('/api/projects/' + urlname).success(function(data) {
        if (typeof data !== undefined && null !== data && $routeParams.name !== urlname) { // project name already exists
          $scope.projectform.name.$setValidity('uniqueName',false);
        } else { // project name doesn't exist
          $scope.projectform.name.$setValidity('uniqueName',true);
        }
      }).error(function(data) {
        console.log('Error: ' + data);
      });
    };

    $scope.saveProject = function() {
      $http.put('/api/projects/' + $routeParams.name, $scope.project).success(function(data) {
        var projectUrlName = data;
        $location.path('/project/' + projectUrlName);
        $scope.projectform.$setPristine();
      }).error(function(data) {
        console.log('Error: ' + data);
      });
    };

    $scope.saveAndReturn = function() {
      $http.put('/api/projects/' + $routeParams.name, $scope.project).success(function(data) {
        $location.path('/');
      }).error(function(data) {
        console.log('Error: ' + data);
      });
    };

  }]);

  
  // set height of admin sections to window height
  var windowHt = $(window).height(),
      footerHt = $('.footer').outerHeight(),
      headerHt = $('.header').outerHeight();
  
  function sectionHt() {
    $('.admin .section').css({'min-height': windowHt - footerHt - headerHt});
  }
  sectionHt();
  
  // do things on window resize
  $(window).on('resize', function() {
    windowHt = $(this).height();
    sectionHt();
  });
  

  // pretty url functions
  var space2dash = function(text) {
    return text.replace(/\s/g,'-');
  };

  var dash2space = function(text) {
    return text.replace(/\-/g,' ');
  };

})();
