app.controller('user', ['$scope', '$resource','$timeout','ngProgressFactory','AuthService','$location', function ($scope,$resource,$timeout,ngProgressFactory,AuthService,$location) {
    $scope.isAuthenticated= AuthService.isAuthenticated();
    if (!$scope.isAuthenticated){
       $timeout(function(){$location.path("/login/login");},1000);
       return;
    }

    $scope.id_attribute="email";
    $scope.name_attribute="Email";
    $scope.api_attribute="/user/api";
    $scope.defaultmodel={email:"",name:"",mobile_no:"",picture_url:"",thisdirty:false};

       $scope.progressbar = ngProgressFactory.createInstance();
       $scope.progressbar.setHeight('4');
       $scope.progressbar.setColor('red');
       $scope.progressbar.start();
       $scope.records = [];
       $scope.initial=[];
       $scope.itemmodel=angular.copy($scope.defaultmodel);
       $scope.Model = $resource($scope.api_attribute);
       $scope.Model.query(function (results) {
         $scope.records = results;
         $scope.progressbar.complete();
       });

       $scope.save = function (item) {
         if (item.email.length>0){
           $scope.progressbar.start();
           item.isedit=false;
           var model = new $scope.Model();
           for (var key in item) {
             if ($scope.itemmodel.hasOwnProperty(key))
                model[key]=item[key];
           }
           model.$save(function (result) {
               $scope.progressbar.complete();
           });
         }
       };
       $scope.deleteRecord = $resource("/user/deleteRecord");
       $scope.delete = function (item) {
         if (item.email.length>0){
           $scope.progressbar.start();
           item.isedit=false;
           var model = new $scope.deleteRecord();
           for (var key in item) {
             if ($scope.itemmodel.hasOwnProperty(key))
                model[key]=item[key];
           }
           model.$save(function (result) {
               $scope.progressbar.complete();
               var index = $scope.records.indexOf(item);
               $scope.records.splice(index, 1);
           });
         }
       };

       $scope.Createnew = $resource("/user/createnew");

       $scope.createnew = function () {
         if ($scope.itemmodel.email.length>0){
           $scope.progressbar.start();
           var model = new $scope.Createnew();
           for (var key in $scope.itemmodel) {
             if ($scope.itemmodel.hasOwnProperty(key))
                model[key]=$scope.itemmodel[key];
           }

           model.$save(function (result) {
             if (result.success)
                 $scope.records.push(result.model);
               $scope.itemmodel=angular.copy($scope.defaultmodel);
               $scope.progressbar.complete();
           });
         }
       };

       $scope.setInit=function(item){
         item.isedit=false;
         item.initial={}
         item.initial = angular.copy(item);
       };
       $scope.edit=function(item){
         item.isedit=true;
       };
       $scope.cancel=function(item){
         var id = item[$scope.id_attribute];
         var name = angular.copy(item.initial.name);
         var log = [];
         angular.forEach($scope.records, function(value, key) {
           if (value[$scope.id_attribute]===id){
               value.name=name;
               value.isedit=false;
           }
         }, log);
       };
}]);
