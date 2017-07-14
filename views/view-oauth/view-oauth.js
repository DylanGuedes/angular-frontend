require('./view-oauth.html');

var angular = require('angular');

angular.module('w3gvault.oauth', ['ngRoute', 'restangular'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/oauth/callback', {
        templateUrl: "view-oauth.html",
        controller: 'OAuthCtrl'
    });
}])

.controller('OAuthCtrl', function ($scope, Restangular,$routeParams,AuthService,$location) {
   Restangular.one("/auth/twitch").get({code:$routeParams.code}).then((res)=>{
        AuthService.login(res.data.token,res.data.displayName,true);
        $location.path("/");
   });
});
