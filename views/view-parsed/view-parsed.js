var angular = require('angular');

angular.module('w3gvault.parsed', ['ngRoute', 'restangular'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/parsed/:parsedid/', {
        templateUrl: 'view-replay.html',
        controller: 'ReplayCtrl'
    });
}])
