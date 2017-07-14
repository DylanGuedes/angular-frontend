require('./view-settings.html');

var angular = require('angular');

angular.module('w3gvault.settings', ['ngRoute', 'restangular'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/settings', {
      templateUrl: 'view-settings.html',
      controller: 'SettingsCtrl'
    });
  }])

  .controller('SettingsCtrl', function($scope, Restangular, $q, $timeout) {
    $scope.settings = {};
    $scope.test = null;

    Restangular.one("user", "self").get().then((response) => {
      $scope.settings = response.data;
    });

    $scope.update = function() {
      return Restangular.one("user", "self").customPUT({
        accounts: $scope.settings.accounts
      }).then((response) => {
        $scope.settings = response.data;
      });

    };
  });
