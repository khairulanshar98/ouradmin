angular.module('Ctrlmodule', [])
.factory ("Ctrlmodule",function () {
 return{
   init:function($scope,$resource,$timeout,angular,ngProgressFactory){
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
       $scope.progressbar.start();
       item.isedit=false;
       var model = new $scope.Model();
       model.name = item.name;
       if ($scope.name_attribute==='Unit Price'){
         model.unit_price= item.unit_price;
       }
       model[$scope.id_attribute] = item[$scope.id_attribute];
       model.$save(function (result) {
           $scope.progressbar.complete();
       });
     };

     $scope.createnew = function () {
       $scope.progressbar.start();
       var model = new $scope.Model();
       for (var key in $scope.itemmodel) {
         if ($scope.itemmodel.hasOwnProperty(key))
            model[key]=$scope.itemmodel[key];
       }
       model.name = $scope.itemmodel.value;
       if ($scope.name_attribute==='Unit Price'){
         model.unit_price= $scope.itemmodel.value;
       }
       model[$scope.id_attribute] = "";
       model.$save(function (result) {
         if (result.success)
             $scope.records.push(result.record);
         $scope.itemmodel=angular.copy($scope.defaultmodel);
         $scope.catgory.model={};
         $scope.product.model={};
         $scope.size.model={};
         $scope.hotcold.model={};
         $scope.progressbar.complete();
       });
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

     //Category List of value
     $scope.catgory={}
     $scope.catgory.model={};
     $scope.catgory.availableOptions=[];
     if ($scope.name_attribute==='Product Name'){
       $scope.changeCatgory = function(){
         $scope.itemmodel.cat_id=$scope.catgory.model.cat_id;
         $scope.itemmodel.cat_name=$scope.catgory.model.name;
       }
       var Category = $resource("/category/api");
       $scope.progressbar.start();
       Category.query(function (results) {
         $scope.catgory.availableOptions=results;
         $scope.progressbar.complete();
       });
     }

     //Size List of value
     $scope.size={}
     $scope.size.model={};
     $scope.size.availableOptions=[];
     if ($scope.name_attribute==='Unit Price'){
       $scope.changeSize = function(){
         $scope.itemmodel.size_id=$scope.size.model.size_id;
         $scope.itemmodel.size_name=$scope.size.model.name;
       }
       var Size = $resource("/size/api");
       $scope.progressbar.start();
       Size.query(function (results) {
         $scope.size.availableOptions=results;
         $scope.progressbar.complete();
       });
     }

     //Product List of value
     $scope.product={}
     $scope.product.model={};
     $scope.product.availableOptions=[];
     if ($scope.name_attribute==='Unit Price'){
       $scope.changeProduct = function(){
         $scope.itemmodel.item_id=$scope.product.model.item_id;
         $scope.itemmodel.item_name=$scope.product.model.name;
         $scope.itemmodel.cat_id=$scope.product.model.cat_id;
         $scope.itemmodel.cat_name=$scope.product.model.cat_name;
       }
       var Product = $resource("/product/api");
       $scope.progressbar.start();
       Product.query(function (results) {
         $scope.product.availableOptions=results;
         $scope.progressbar.complete();
       });
     }

     //Product List of value
     $scope.hotcold={}
     $scope.hotcold.model={};
     $scope.hotcold.availableOptions=[{name:"Hot"},{name:"Cold"}];
     if ($scope.name_attribute==='Unit Price'){
       $scope.changeHotCold = function(){
         $scope.itemmodel.hot_cold=$scope.hotcold.model.name;
       }
     }


   }
 }
});
