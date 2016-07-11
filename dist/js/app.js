var app = angular.module("dpApp", ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'loginCtrl',
            templateUrl: 'login.html'
        })
        .when('/deploy', {
            controller: 'dpDeployCtrl',
            templateUrl: 'dp_deploy.html'
        })
        .when('/status', {
            controller: 'dpStatusCtrl',
            templateUrl: 'dp_status.html'
        })

        .otherwise({

        });
});

var baseUrl = "http://yxzhm.com/api/TokenDP/";
var token="";

app.controller('dpStatusCtrl', function ($scope, $location) {
    if(token.length==0){
        $location.path('/');
    }

});
app.controller('dpDeployCtrl', function ($scope, $location) {
    if(token.length==0){
        $location.path('/');
    }

});


app.controller('loginCtrl', function ($scope, $location,$http) {
    $scope.verify = function () {
        $http({
            method: 'POST',
            url: baseUrl+'Login',
            data: 'loginname=cps&password=cps',
            headers: {
                'Content-Type': 'application/json'
            },
            transformResponse: [function (data) {
                return data;
            }]
        }).success(function(data, status, header, config) {
           if(data.toString().length>0){
               token=data.toString();
               $location.path('/status');
           }

        }).error(function(data, status, header, config){
            console.log(header());
            console.log(config);
        })
    }

});
