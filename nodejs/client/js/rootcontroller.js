angular.module('rootController', [])
.controller('rootController', ['$scope', '$resource','$location', '$timeout','ngProgressFactory','AuthService','AUTH_EVENTS',function ($scope, $resource,$location,$timeout,ngProgressFactory,AuthService,AUTH_EVENTS) {
$scope.user={email:"",passwd:"",passwdRepeat:""};
$scope.basePath=$location.$$path;
$scope.objectDisabled=false;
$scope.isAuthenticated= AuthService.isAuthenticated();
$location.path("/");
if ($scope.isAuthenticated){
   if ($scope.basePath.indexOf("/login/")>=0){
     $timeout(function(){$location.path($scope.basePath);},1000);
   }else{
       $timeout(function(){$location.path("/main");},1000);
   }
}else{
   $timeout(function(){$location.path("/login/login");},1000);
}
$scope.user.email = AuthService.getEmail();

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    alert('You are not allowed to access this resource.');
    /*var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });*/
  });
  $scope.$on(AUTH_EVENTS.wrongPassword, function(event) {
    AuthService.logout();
    $timeout(function(){$location.path("/login/login");},1000);
    /*var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });*/
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    alert('Session Lost!\nSorry, You have to login again.');
    $timeout(function(){$location.path("/main");},1000);
    /*var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });*/
  });
  $scope.setCurrentEmail = function(email) {
    $scope.user.email = email;
  };
  $scope.logout = function() {
    AuthService.logout();
    $scope.isAuthenticated= AuthService.isAuthenticated();
    $location.path("/login/login");
  };
  $scope.login = function(data) {
    $scope.objectDisabled=true;
    AuthService.login(data).then(function(success) {
      $scope.setCurrentEmail(data.email);
      $scope.isAuthenticated= AuthService.isAuthenticated();
      $scope.objectDisabled=false;
      $location.path("/main");
    }, function(err) {
      alert(err);
      $scope.objectDisabled=false;
    });
  };
  $scope.signup = function(data) {
    $scope.objectDisabled=true;
    AuthService.signup(data).then(function(success) {
       $scope.objectDisabled=false;
       $scope.isAuthenticated= AuthService.isAuthenticated();
       $location.path("/main");
    }, function(err) {
       alert(err);
       $scope.objectDisabled=false;
    });
  };


}]);
