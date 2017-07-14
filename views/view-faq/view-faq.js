require('./view-faq.html');

var angular = require('angular');

angular.module('w3gvault.faq', ['ngRoute', 'restangular'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/faq/', {
        templateUrl: 'view-faq.html',
        controller: 'FAQCtrl'
    });
}])

.controller('FAQCtrl', function ($scope, Restangular ) {

});
