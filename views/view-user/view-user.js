require('./view-user.html');

var angular = require('angular');

angular.module('w3gvault.user', ['ngRoute', 'restangular'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/user/:username/', {
        templateUrl: 'view-user.html',
        controller: 'UserCtrl'
    });
}])

.controller('UserCtrl', function ($scope, Restangular, $routeParams, $location ) {
    $scope.user = {};
    $scope.replays = [];

    Restangular.one("user",$routeParams.username).get().then(function(response){
        console.log(response);
        $scope.user = response.data;
        console.log(response);
        Restangular.one("user",$routeParams.username).all("replay").getList().then(function(response){
            console.log("got user replays:",response.data);
            $scope.replays = response.data;
        });
    }, function(err){
        console.log("error",err);
        $location.path("/404");
    });
});
