var angular = require('angular');

//Config
angular.module('w3gvault').config(function ($httpProvider) {
    $httpProvider.interceptors.push('APITokenInterceptor');
});
//Interceptor factory
angular.module('w3gvault.services', [])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .service('Session', function (localStorageService,$log) {
        this.create = function (token, username, roles,capabilities) {
            this.token = token;
            this.username = username;
            this.roles = roles;
            this.capabilities = capabilities;
        };
        this.destroy = function () {
            localStorageService.remove("token");
            localStorageService.remove("username");
            localStorageService.remove("roles");

            localStorageService.remove("capabilities");
            this.token = null;
            this.username = null;
            this.roles = null;

            this.capabilities = null;
        };

        //add session persistence by storing and loading the token as needed
        this.load = function(){
            this.token = localStorageService.get("token");
            this.username = localStorageService.get("username");
            this.roles = localStorageService.get("roles");

            this.capabilities = localStorageService.get("capabilities");
            $log.info("Loaded session from localStorage: ",this);
            return this;
        };

        this.save = function (){

            localStorageService.set("token",this.token);
            localStorageService.set("username",this.username);
            localStorageService.set("roles",this.roles);
            localStorageService.set("capabilities",this.capabilities);
            $log.info("Saved Session to localStorage: ",this);
            return this;
        };

    })

.service("AuthService", function ($rootScope, Restangular, Session, AUTH_EVENTS,$log) {
    var authService = {};

    authService.login = function (token,username,persistent = false) {
        Session.create(token, username,[],[]);
        $log.info("Login called: ", this);
        if (persistent === true){
            Session.save();
        }

        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, Session);
    };

    authService.load = function (){
        if (Session.load().token){
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, Session);
        }
        else {
            $log.info("No previous session, proceeding as anonymous.");
        }
    };

    authService.logout = function () {
        Session.destroy();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    };

    authService.isAuthenticated = function () {
        return !!Session.token;
    };

    authService.getUserId = function(){
        return Session.user_id;
    };

    authService.getUserName= function(){
        return Session.username;
    };

    authService.hasRole = function (role) {
        return Session.roles.indexOf(role) !== -1;
    };

    authService.canDo = function (capability){
      return Session.capabilities.indexOf(capability) !== -1;
    };

    return authService;
})

.service('APITokenInterceptor', function ($rootScope, Session, AUTH_EVENTS, $q) {
    var service = this;
    service.request = function (config) {
        var token = Session.token;
        if (token) {
            config.headers.Authorization = "JWT " + token;
        }
        return config;
    };
    service.response = function (response) {
        if (response.data.message) {}
        return response;
    };
    service.responseError = function (response) {
        $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        }[response.status], response);
        return $q.reject(response);
    };
});
