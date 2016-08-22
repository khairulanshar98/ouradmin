var app = angular.module('ouradmin', ['ngRoute','ngResource','ngProgress','Ctrlmodule','rootController'])
.constant('AUTH_EVENTS', {
  "notAuthenticated": 'auth-not-authenticated',
  "wrongPassword": 'wrong-password',
  "notAuthorized": 'auth-not-authorized'
})
.constant('USER_ROLES', {
  "admin": 'admin_role',
  "public": 'public_role'
})
.config(['$routeProvider','$controllerProvider', function ($routeProvider, $controllerProvider) {
        app.controller = $controllerProvider.register;
        $routeProvider
                .when('/:name', {
                    templateUrl: function (urlattr) {
                        return 'views/partials/' + urlattr.name + ".html";
                    }
                })
                .when('/:name/:arg1', {
                    templateUrl: function (urlattr) {

                        return 'views/partials/' + urlattr.name + ".html";
                    }
                })
                .when('/:name/:arg1/:arg2', {
                    templateUrl: function (urlattr) {
                        return 'views/partials/' + urlattr.name + ".html";
                    }
                })
                .when('/:name/:arg1/:arg2/:arg3', {
                    templateUrl: function (urlattr) {
                        return 'views/partials/' + urlattr.name + ".html";
                    }
                })
                .when('/:name/:arg1/:arg2/:arg3/:arg4', {
                    templateUrl: function (urlattr) {
                        return 'views/partials/' + urlattr.name + ".html";
                    }
                })
                .when('/:name/:arg1/:arg2/:arg3/:arg4/:arg5', {
                    templateUrl: function (urlattr) {
                        return 'views/partials/' + urlattr.name + ".html";
                    }
                })
                .when('/:name/:arg1/:arg2/:arg3/:arg4/:arg5/:arg6', {
                    templateUrl: function (urlattr) {
                        return 'views/partials/' + urlattr.name + ".html";
                    }
                })
                .when('/', {
                    templateUrl: '/views/partials/root.html'
                })
                .otherwise({redirectTo: '/main'});
        ;
    }])
    .run(['$rootScope', '$location','ngProgressFactory',function ($rootScope, $location,ngProgressFactory) {
      $rootScope.progressbar = ngProgressFactory.createInstance();
      $rootScope.progressbar.setHeight('4');
      $rootScope.progressbar.setColor('#066dab');
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
          $rootScope.progressbar.start();
            if (current && next && next.params) {
                next.$$route.controller = next.params.name;
                $rootScope.progressbar.complete();
            }
        });
    }]);
