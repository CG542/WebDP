var app = angular.module("dpApp", ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            controller: 'dpCtrl',
            templateUrl: 'dp.html'
        })
        .when('/login',{
            controller: 'loginCtrl',
            templateUrl: 'login.html'
        })
        .otherwise({

        });
});

app.controller('dpCtrl', function($scope, $location){


});

app.controller('loginCtrl', function($scope, $location){
    $scope.verify= function (){
        if ($scope.loginname == "cps" && $scope.psw=="cps") {
            app.value('Token','123');
            $location.path('/');
        }
    }

});
