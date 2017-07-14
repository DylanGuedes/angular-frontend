require('./view-replay.html');
require('./view-replay-player.html');
require('./view-replay-player2.html');
require('./view-replay-meta.html');

var angular = require('angular');

angular.module('w3gvault.replay', ['ngRoute', 'restangular'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/replay/:replayid/', {
      templateUrl: 'view-replay.html',
      controller: 'ReplayCtrl'
    });
  }])

  .controller('ReplayCtrl', function($scope, Restangular, $routeParams) {
    var request = null;
    $scope.replay = {};
    $scope.isCollapsed = true;
    $scope.playerNames = [];
    $scope.actionNames = [];
    $scope.apmTimeData = [];
    $scope.apmActionData = [];
    $scope.apmTimeDataTotalCount = 0;
    $scope.apmTimeDataSampleInterval = 60;

    if ($routeParams.replayid) {
      request = Restangular.one("replay", $routeParams.replayid).get()
    } else if ($routeParams.parsedid) {
      request = Restangular.one("parsed", $routeParams.parsedid).get()
    }




    request.then(function(res) {
      $scope.replay = res.data;
      var first = true;
      angular.forEach(res.data.teams, function(team, teamIndex) {
        angular.forEach(team, function(player, playerIndex) {
          var t = {
            type: "line",
            name: player.name,
            data: [],
            lineStyle: {
              color: player.color
            }
          };
          //var x = {name: player.name, datapoints:[] };
          $scope.playerNames.push(player.name);
          $scope.apmTimeDataSampleInterval = player.apm_timed.sampleInterval;
          $scope.apmTimeDataTotalCount = player.apm_timed.data.length > $scope.apmTimeDataTotalCount ? player.apm_timed.data.length : $scope.apmTimeDataTotalCount;
          angular.forEach(player.apm_timed.data, function(data, index) {
            t.data.push(data);
          });
          $scope.apmTimeData.push(t);

          var player_actions = {
            type: "bar",
            name: player.name,
            data: []
          };
          angular.forEach(player.actions, function(action, index) {
            if (first) {
              $scope.actionNames.push(action.action);
            }
            player_actions.data.push(action.count);
          });
          $scope.apmActionData.push(player_actions);
          first = false;
        })

        $scope.updateCharts();
      })
    });

    $scope.toggleDetails = function toggleDetails() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.apmTimeChartConfig = {
      type: "line",
      legend: {
        data: []
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        axisLabel: {
          formatter: function(value, index) {
            // Formatted to be month/day; display year only in the first label
            return ((index * 60 / 60) + ":" + (index * 60) % 60);
          }
        }
      }],
      yAxis: [{
        type: 'value'
      }],
      series: []
    };

    $scope.apmBarChartConfig = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: []
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: []
      },
      series: []
    };

    $scope.updateCharts = function() {
      var dom = document.getElementById("apmTimeChart");
      var apmTimeChart = echarts.init(dom);

      $scope.apmTimeChartConfig["series"] = $scope.apmTimeData;
      $scope.apmTimeChartConfig["legend"]["data"] = $scope.playerNames;


      var foo = [];
      for (var i = 0; i < $scope.apmTimeDataTotalCount; i++) {
        foo.push(i);
      }
      $scope.apmTimeChartConfig["xAxis"][0]["data"] = foo;
      $scope.apmTimeChartConfig["xAxis"][0].axisLabel.formatter = function(value, index) {
        var interval = $scope.apmTimeDataSampleInterval;
        var min = Math.floor((index * interval) / 60);
        var sec = (index * interval) % 60;
        if (sec === 0) {
          sec = "00"
        }

        return min + ":" + sec;
      }

      apmTimeChart.setOption($scope.apmTimeChartConfig, true);


      dom = document.getElementById("apmBarChart");
      var apmActionChart = echarts.init(dom);
      $scope.apmBarChartConfig["series"] = $scope.apmActionData;
      $scope.apmBarChartConfig["legend"]["data"] = $scope.playerNames;
      $scope.apmBarChartConfig["yAxis"]["data"] = $scope.actionNames;
      apmActionChart.setOption($scope.apmBarChartConfig, true);
    };




  });
