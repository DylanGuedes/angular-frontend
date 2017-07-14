var angular = require ('angular');

require ("bootstrap");
require ("bootstrap/dist/css/bootstrap.min.css");
require ('animate.css')

require ('./sass/w3gvault.scss');
require ('./css/loading-button.css');

require ( 'moment');
require ( 'angular-route');
require ( 'angular-sanitize');
require ( 'restangular');
require ( 'angular-toastr/dist/angular-toastr.css');
require ( 'angular-toastr/dist/angular-toastr.js');
require ( 'angular-toastr/dist/angular-toastr.tpls.js');

require ( 'angular-moment');
require ( 'angular-bootstrap');
require ( "angular-local-storage");
require ( 'angular-loading-bar');
require ( 'ng-file-upload');

require ( 'angular-echarts/dist/angular-echarts.js');


require ( './js/ui-bootstrap-tpls_custom.js');



require('angular-promise-buttons');

angular.module('w3gvault', [
  'ngRoute',
  'ngSanitize',
  'restangular',
  'angularMoment',
  'angular-echarts',
  'ui.bootstrap',
  'toastr',
  'ngFileUpload',
  'LocalStorageModule',
  'angular-loading-bar',
  'w3gvault.services',
  'w3gvault.index',
  'w3gvault.users',
  'w3gvault.replay',
  'w3gvault.parsed',
  'w3gvault.user',
  'w3gvault.faq',
  'w3gvault.settings',
  'w3gvault.oauth',
  'w3gvault.upload',
  'angularPromiseButtons'
])

.config(['$locationProvider', '$routeProvider', 'RestangularProvider',"angularPromiseButtonsProvider", function ($locationProvider, $routeProvider, RestangularProvider, angularPromiseButtonsProvider) {
    $locationProvider.html5Mode(true).hashPrefix('*');
    RestangularProvider.setBaseUrl('http://localhost:4000/api/');
    RestangularProvider.setFullResponse(true);
    $routeProvider.otherwise({
        redirectTo: '/'
    });

    angularPromiseButtonsProvider.extendConfig({
        minDuration: 1000,
  });

}])



.controller('AppCtrl', function ($scope, $rootScope, AUTH_EVENTS,$timeout,AuthService,$location,toastr,$log) {
    $scope.auth = AuthService;
    $scope.userMenuOpen =true;
    $scope.userSession = null;
    $scope.pageLoaderStyle = {display:"none"};
    $scope.twitchAuthURL = "https://api.twitch.tv/kraken/oauth2/authorize?client_id=xbtls319br0nnkoqt2aaf1z8utwq6a&redirect_uri=http://localhost:3000/oauth/callback&response_type=code&scope=user_read";

    $scope.setUserSession = function(session){
        $scope.userSession = session;
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, session) {
        $scope.setUserSession(session);
    });

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, response) {
        AuthService.logout();
        toastr.info('We logged you out because your session has expired. Please log in again!', 'Session expired');
        $location.path("/");
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event, response) {
        toastr.success('', 'Logout successful');
        $scope.username = "";
        $scope.setUserSession(session);
        $location.path("/");
    });


    $scope.logout = function () {
        AuthService.logout();
    };

    $scope.showPageLoader=function(){
        $scope.pageLoaderStyle = {display:"block"};
    };

    $log.info("AppCtrl instantiated.");
    AuthService.load();

})

.controller('NavbarCtrl', ['$scope', '$location',
    function ($scope, $location) {
            // Get current path to use it for adding active classes to our submenus
            $scope.path = $location.path();

    }
])

.controller('HeaderCtrl', ['$scope',
    function ($scope) {
        // When view content is loaded
    }
]);

require("./views/views.js");
require("./components/components.js");
require("./directives/directives.js");
require("./filters/filters.js");
