angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$http,serverProp,$state,$window,ngProgressFactory) {
     $scope.progressbar = ngProgressFactory.createInstance();
     $scope.progressbar.setHeight('4');
     $scope.progressbar.setColor('red');
  function loadUserCredentials() {
    var token = window.localStorage.getItem(serverProp.LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {email:"",passwd:""};
  $scope.isAuthenticated = false;
  loadUserCredentials();


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  $scope.loginText="Login";

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    if ($scope.loginText==="Login" && $scope.loginData.email.length>0 && $scope.loginData.passwd.length > 0){
      $scope.progressbar.start();
      $scope.loginText==="Checking..."
      $http.post(serverProp.url+'/user/authenticate',$scope.loginData).then(
          function(result) {
            storeUserCredentials($scope.loginData.email+"#"+result.data.token);
            $timeout(function() {
              $scope.closeLogin();
              $scope.progressbar.complete();
              $scope.loginText="Login";
            }, 100);
          }, function(err) {
            $scope.loginText="Login";
          });
    }
  };

  $scope.doLogout = function() {
    $scope.progressbar.start();
    $scope.isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(serverProp.LOCAL_TOKEN_KEY);
    $state.go('app.main', {}, {reload: false});
    $scope.progressbar.complete();
    $window.location.reload();
  };


  function storeUserCredentials(token) {
    window.localStorage.setItem(serverProp.LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(secret) {
    $scope.isAuthenticated = true;
    var email = secret.split('#')[0];
    var authToken = secret.split('#')[1];
    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = authToken;
  }

})

.controller('UsersCtrl', function($scope,$resource,serverProp,$state) {
  if (!$scope.isAuthenticated){
    $state.go('app.main', {}, {reload: true});
    return;
  }
  $scope.id_attribute="email";
  $scope.name_attribute="Email";
  $scope.api_attribute=serverProp.url+"/user/api";
  $scope.defaultmodel={email:"",name:"",mobile_no:"",picture_url:"",thisdirty:false};
  $scope.records = [];
  $scope.initial=[];
  $scope.itemmodel=angular.copy($scope.defaultmodel);
  $scope.Model = $resource($scope.api_attribute);
  $scope.progressbar.start();
  $scope.Model.query(function (results) {
    $scope.records = results;
    $scope.progressbar.complete();
  });
  $scope.initRecord=function(user){
     if ( typeof user["picture_url"]==="undefined"  || user.picture_url===null|| user.picture_url.length===0){
        user.picture_url="img/avatar.png";
     }else{
       console.log(user)
     }
  }
  $scope.goTo=function(user){
    $state.go('app.user', {email: user.email,name:user.name}, {reload: true});
  }


})

.controller('UserCtrl', function($scope, $stateParams,serverProp,$resource,$http) {
  if (!$scope.isAuthenticated){
    $state.go('app.main', {}, {reload: true});
    return;
  }
  $scope.record ={};
  $scope.progressbar.start();
  $http.get(serverProp.url+'/user/api/email/'+$stateParams.email).then(
      function(result) {
        var record_ = result.data;
        if ( typeof record_["picture_url"]==="undefined" || record_["picture_url"]===null|| record_["picture_url"].length===0){
           record_["picture_url"]="img/avatar.png";
        }
        if ( typeof record_["bio"]==="undefined"  || record_["bio"]===null || record_["bio"].length===0){
           record_["bio"]="This is a styled Card. The header is created from a Thumbnail List item, the content is from a card-body consisting of an image and paragraph text.";
        }
        $scope.record=record_;
        $scope.progressbar.complete();
      }, function(err) {
        $scope.progressbar.complete();
      });




});
