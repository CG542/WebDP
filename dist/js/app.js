var loginapp = angular.module("loginapp", []);
loginapp.controller("loginctrl", function($scope) {
    $scope.verify= function (){
        if ($scope.loginname == "cps" && $scope.psw=="cps") {
            $scope.loginname="abc";
            $location.path('index.html');
        }
    }
});