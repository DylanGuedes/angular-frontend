var angular = require('angular');
angular.module('w3gvault.services')
.factory('alertService', function($rootScope,$timeout) {
    var alertService = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alertService.closeAlert = function(index) {
        console.log("closeAlert",index);
      $rootScope.alerts.splice(index, 1);
    };
    
    alertService.add = function(type, heading, msg, timeout = 0) {
      var alert = {"type": "alert-"+type,"heading" :heading,'message': msg,close: alertService.closeAlert};
      
      $rootScope.alerts.push(alert);

      if (timeout > 0 ){
          console.log(timeout);
          $timeout(function(){
              alertService.closeAlert($rootScope.alerts.indexOf(alert));
          },timeout*1000);
      }    
    };    

    return alertService;
  });