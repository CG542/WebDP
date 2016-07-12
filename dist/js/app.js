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
var lastStatusQueryTime='2016-06-23 19:55:43';


app.controller('dpStatusCtrl', function ($scope, $location,$interval,$http) {
    if(token.length==0){
        $location.path('/');
    }

    $scope.statuslist=[];

    var loadData = $interval(function(){
        //$interval.cancel(loadData);
        var currentTime = new Date().Format("yyyy-MM-dd hh:mm:ss");

        $http({
            method: 'GET',
            url: baseUrl+'QueryDPStatus?'+'token='+token+'&time='+lastStatusQueryTime,
            headers: {
                'Content-Type': 'application/json'
            },
            transformResponse: [function (data) {
                return data;
            }]
        }).success(function(data, status, header, config) {
            var statusJson = angular.fromJson(data);
            for(var i=0;i<statusJson.dpStatusEntity.length;i++){

                $scope.statuslist.splice(0,0,
                    {
                    'name':statusJson.dpStatusEntity[i].DPName,
                    'time': statusJson.dpStatusEntity[i].reporttime,
                    'info': statusJson.dpStatusEntity[i].status
                    }
                ) ;
            }
            lastStatusQueryTime=currentTime;
            //$scope.statuslist.add

        }).error(function(data, status, header, config){
            console.log(header());
            console.log(config);
        })
        //$interval.start(loadData);
    },5000);

    $scope.$on('$destroy',function(){
        $interval.cancel(loadData);
    })

});


app.controller('dpDeployCtrl', function ($scope, $location,$http) {
    if(token.length==0){
        $location.path('/');
    }
    $scope.dplist=[];
    $scope.profilelist=[];

    $http({
        method: 'GET',
        url: baseUrl+'GetAllDPNames?'+'token='+token,
        headers: {
            'Content-Type': 'application/json'
        },
        transformResponse: [function (data) {
            return data;
        }]
    }).success(function(data, status, header, config) {
        var dpJson = angular.fromJson(data);
        for(var i=0;i<dpJson.DP.length;i++) {
            $scope.dplist.push({'dpname':dpJson.DP[i].name}) ;
        }

    }).error(function(data, status, header, config){
        console.log(header());
        console.log(config);
    })

    $http({
        method: 'GET',
        url: baseUrl+'GetAllSettings?'+'token='+token,
        headers: {
            'Content-Type': 'application/json'
        },
        transformResponse: [function (data) {
            return data;
        }]
    }).success(function(data, status, header, config) {
        var profileJson = angular.fromJson(data);
        for(var i=0;i<profileJson.settingEntity.length;i++) {
            $scope.profilelist.push({'profilename':profileJson.settingEntity[i].profilename}) ;
        }

    }).error(function(data, status, header, config){
        console.log(header());
        console.log(config);
    })

    $scope.deploy=function(){
        var selectedDP = $scope.seldp;
        var selectedProfile = $scope.selprofile;

        $http({
            method: 'POST',
            url: baseUrl+'SetDPConfig',
            data: 'token='+token+'&dpname='+selectedDP+'&profilename='+selectedProfile,
            headers: {
                'Content-Type': 'application/json'
            },
            transformResponse: [function (data) {
                return data;
            }]
        }).success(function(data, status, header, config) {
            console.log(data);
        }).error(function(data, status, header, config){
            console.log(header());
            console.log(config);
        })
    }
});


app.controller('loginCtrl', function ($scope, $location,$http) {
    $scope.verify = function () {
        $http({
            method: 'POST',
            url: baseUrl+'Login',
            data: 'loginname='+$scope.loginname+'&password='+$scope.psw,
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

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
