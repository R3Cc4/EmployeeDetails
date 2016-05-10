var loginapp = angular.module('loginapp',['ngRoute']);
loginapp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('loginSuccess', {
        url: '/',
        templateUrl: 'test',
        controller: 'MainCtrl',
        loginRequired:true
      })
     .when('loginFailure', {
        url:'/login',
        templateUrl: 'login',
        controller: 'loginCtrl'
      })
 }]);
loginapp.controller('loginCtrl',['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location){

    var postLogInRoute;

   /* $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {

    //if login required and you're logged out, capture the current path
        if (nextRoute.loginRequired && Account.loggedOut()) {
          postLogInRoute = $location.path();
          $location.path('/login').replace();
        } else if (postLogInRoute && Account.loggedIn()) {
    //once logged in, redirect to the last route and reset it
          $location.path(postLogInRoute).replace();
          postLogInRoute = null;
        }
    });
*/
$scope.loginAction = function(user,pass){
    
    console.log(user+"*****"+pass);
    var authDetails = {'name':user,'password':pass};
    console.log(authDetails);
    $http({
        method:'GET',
        url:'/loginuser',
        headers: {
   'Content-Type': 'application/x-www-form-urlencoded'
 },
  params: {
           auth: JSON.stringify(authDetails)
          }
        
    }).success(function(data){
        console.log(data);
        
        
        if(typeof data.token != undefined){
            window.localStorage.setItem('token',data.token);
            var token = data.token;
            
            console.log(window.location);
            window.location.assign("/login")
           /* $http({method:'GET',
            url:'/loggedin',
            headers:{
                'x-access-token':token
            }
            })*/
        }else {
            window.location.assign("/"); 
            $scope.ErrorMessage = "Invalid UserName or password";
        }
    });
};

}]);