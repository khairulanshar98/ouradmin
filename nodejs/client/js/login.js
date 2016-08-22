app.controller('login', ['$scope', '$resource','$routeParams','AuthService', function ($scope, $resource,$routeParams,AuthService) {
  $scope.arg1=$routeParams.arg1;
  $scope.showpasswd=false;
}]);
