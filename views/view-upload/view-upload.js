require('./view-upload.html');

var angular = require('angular');

angular.module('w3gvault.upload', ['ngRoute', 'restangular'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/upload', {
        templateUrl: 'view-upload.html',
        controller: 'UploadCtrl'
    });
}])

.controller('UploadCtrl', function ($scope, Restangular, $timeout, $location, toastr ) {
    $scope.uploadLoader = false;
    $scope.parseLoader = false;

    $scope.uploadReplayClick = function(){
        $timeout(function() {
            angular.element(document.getElementById('replay-upload')).trigger('click');
        }, 0);
    };

    $scope.uploadReplay = function(event){
        var fd = new FormData();
        fd.append("replay", event[0]);
        $scope.uploadLoader = true;
        Restangular.all("replay").customPOST(fd, undefined, undefined,
            { 'Content-Type': undefined }).then(function(res){
            $scope.uploadLoader = false;
            $location.path("/replay/"+res.data._id);
        },
        function(err){
            $scope.uploadLoader = false;
            toastr.error(err.data.message, 'Error');
        }
        );
    };

    $scope.parseReplayClick = function(){
        $timeout(function() {
            angular.element(document.querySelector('#replay-parse')).trigger('click');
        }, 0);

    };

    $scope.parseReplay = function(event){
      var fd = new FormData();
      fd.append("replay", event[0]);
      $scope.parseLoader = true;
      Restangular.all("replay/parse").customPOST(fd, undefined, undefined,
          { 'Content-Type': undefined }).then(function(res){
          $scope.parseLoader = false;
          $location.path("/parsed/"+res.data._id);
      },
      function(err){
          $scope.uploadLoader = false;
          toastr.error(err.data.message, 'Error');
      }
      );
    };

});
