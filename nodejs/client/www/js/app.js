// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngResource','ngProgress'])
.constant('serverProp', {
  "url": '',
  "LOCAL_TOKEN_KEY":"yourTokenKey"
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.main', {
      url: '/main',
      views: {
        'menuContent': {
          templateUrl: 'templates/main.html'
        }
      }
    })
    .state('app.users', {
      url: '/users',
      views: {
        'menuContent': {
          templateUrl: 'templates/users.html',
          controller: 'UsersCtrl'
        }
      }
    })

  .state('app.user', {
    url: '/users/:email',
    views: {
      'menuContent': {
        templateUrl: 'templates/user.html',
        controller: 'UserCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
}).directive('browseto', function ($ionicGesture, $ionicPopup) {
      return {
          restrict: 'A',
          scope: {
              url: '@browseto'
          },
          link: function ($scope, $element, $attrs) {
              var handleTap = function (e) {
                  // todo: capture Google Analytics here
                  e.preventDefault();
                                       $ionicPopup.confirm({
                                           title: 'Confirmation',
                                           template: 'Do you want to open external link?',
                                           buttons: [{text: 'No'}, {text: 'Yes', type: 'btn-gold',
                                                   onTap: function (e) {
                                                       window.open(encodeURI($scope.url), '_system', 'location=yes');
                                                   }

                                               }]
                                       }).then(function (res) {

                                       })



              };
              var tapGesture = $ionicGesture.on('tap', handleTap, $element);
              //var clickGesture = $ionicGesture.on('click', handleTap, $element);
              //var touchGesture = $ionicGesture.on('touch', handleTap, $element);
              $scope.$on('$destroy', function () {
                  // Clean up - unbind drag gesture handler
                  $ionicGesture.off(tapGesture, 'tap', handleTap);
                  //$ionicGesture.off(clickGesture, 'click', handleTap);
                  //$ionicGesture.off(touchGesture, 'touch', handleTap);
              });
              /*$element.bind('click', handleTap);
               $element.bind('touch', handleTap);
               $element.bind('tap', handleTap);*/
          }
      }
  });
