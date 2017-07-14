require('./view-users.html');

var angular = require('angular');

angular.module('w3gvault.users', ['ngRoute', 'restangular'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/users', {
        templateUrl: 'view-users.html',
        controller: 'UsersCtrl'
    });
}])

.controller('UsersCtrl', function ($scope, Restangular, $log ) {
      $scope.users = [];

      Restangular.all("user").getList().then(function(response){
          $log.info("Loaded user collection: ",response.data);
          $scope.users = response.data;
      });

});
