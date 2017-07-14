require('./view-index.html');

var angular = require('angular');

angular.module('w3gvault.index', ['ngRoute', 'restangular'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'view-index.html',
        controller: 'IndexCtrl'
    });
}])

.controller('IndexCtrl', function ($scope, Restangular, $log ) {
      $scope.user = {};
      $scope.replays = [];

      Restangular.all("replay").getList().then(function(response){
          $log.info("Loaded Index replay collection: ",response.data);
          $scope.replays = response.data;
      });

});
