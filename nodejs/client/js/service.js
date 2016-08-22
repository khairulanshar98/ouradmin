angular.module('ouradmin')
.service('AuthService', ['$q', '$http', 'USER_ROLES', function($q, $http, USER_ROLES) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var email = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(secret) {
    email = secret.split('#')[0];
    isAuthenticated = true;
    authToken = secret.split('#')[1];

    if (email == 'admin') {
      //role = USER_ROLES.admin
    }
    if (email == 'user') {
      //role = USER_ROLES.public
    }

    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = secret.split('#')[1];
  }

  function destroyUserCredentials() {
    authToken = undefined;
    email = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var signup = function(data) {
    return $q(function(resolve, reject) {
      if (data.email.length>0 && data.passwd.length > 0 && data.passwdRepeat.length > 0) {
          if (data.passwd !== data.passwdRepeat){
            reject('Please check your password and repreat password');
          }else{
            $http.post('/user/register',data).then(
                function(result) {
                  storeUserCredentials(data.email+"#"+result.data.token);
                  resolve(result);
                }, function(err) {
                  console.log(err);
                  reject(err.data.msg);
                });
          }
      } else {
        reject('Please Enter your email, password and repreat password');
      }
    });
  };

  var login = function(data) {
    return $q(function(resolve, reject) {
      $http.post('/user/authenticate',data).then(
          function(result) {
            storeUserCredentials(data.email+"#"+result.data.token);
            resolve(result);
          }, function(err) {
            reject(err.data.msg);
          });
    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };

  loadUserCredentials();

  return {
    login: login,
    signup:signup,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    getEmail: function() {return email;},
    getRole: function() {return role;}
  };
}])
.factory('AuthInterceptor',['$rootScope', '$q', 'AUTH_EVENTS', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        402: AUTH_EVENTS.wrongPassword,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
}])
.config(['$httpProvider',function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}]);
