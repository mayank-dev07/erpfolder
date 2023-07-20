var myApp = angular.module('myModule', ['ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('main',{
    url:'/main',
    templateUrl: 'main.html',
    controller: 'mainController'
  })
  .state('login',{
    url:'/login',
    templateUrl: 'login.html',
    controller: 'loginController'
  })
  .state('manager',{
    url: '/manager',
    templateUrl: 'manager.html',
    controller: 'managerController'
  })
  .state('add',{
    url: '/add',
    templateUrl: 'add.html',
    controller: 'addController'
  })
  .state('section',{
    url: '/section',
    templateUrl: 'section.html',
    controller: 'sectionController'
  })
  .state('register',{
    url: '/register',
    templateUrl: 'register.html',
    controller: 'registerController'
  })
  $urlRouterProvider.otherwise('/login');
}]);

const apiUrl = "http://10.21.81.205:8000"

myApp.controller('registerController', function($scope, $http, $location) {
  $scope.registeration = function (){
    let registered = {
      username : $scope.registerationuserName,
      password : $scope.registerationPassword,
      address : $scope.registerationuseraddress,
      contact : $scope.registerationConfirmPassword,
      email : $scope.registerationEmail,
      first_name : $scope.registerationfirstName,
      last_name :$scope.registerationlastName
    }
    
    let pass = $scope.registerationPassword;
    let cp = $scope.registerationConfirmPassword;
    
    console.log(registered)
    
    if(pass === cp){
      $http.post(apiUrl + "/register",registered)
      .then(function (response){
        console.log(response);
        $location.path('/login');
      })
      .catch(function(error){
        if(error.data.message){
          $window.alert(error.data.message)
        }
        else{
          $window.alert("there is an error")
        }
      })
    }
    else{
      alert('Password is not matching')
    }
  }
});

myApp.controller('loginController', function($scope, $http, $location,$window) {
  $scope.login = function (){
    let data = {
      username: $scope.loginName,
      password: $scope.loginPassword
    }
    
    console.log(data)
    
    $http.post(apiUrl + "/login1",data)
    .then(function(response){
      console.log(response)
      let manage = response.data.message
      console.log(manage);
      if(manage === "Store Manager logged in"){
        $location.path('/manager')
      }
      else{
        $location.path('/main')
      }
    })
    .catch(function(error){
      if(error.data.message){
        $window.alert(error.data.message)
      }
      else{
        $window.alert("there is an error")
      }
    })
  }
});


myApp.controller('sectionController', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {};
    
    $scope.submitForm = function() {
      var file = $scope.formData.image;
      var text = $scope.formData.text;
      
      var formData = new FormData();
      formData.append('sectionImage', file);
      formData.append('sectionName', text);
      
      $http.post(apiUrl + "/section", formData, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      })
      .then(function(response) {
        console.log('Data uploaded successfully');
        $scope.imageURL = response.data.imageURL;
      })
      .catch(function(error) {
        console.error('Error uploading data:', error);
      });
    };
  }]);
  
  
  myApp.directive('fileModel', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        
        element.bind('change', function() {
          scope.$apply(function() {
            var file = element[0].files[0];

            
            modelSetter(scope, file);
          });
        });
      }
    };
  }]);
  

  myApp.controller('managerController', function($scope, $http, $location) {
    $scope.sections = [];
  
    $scope.addSection = function() {
      var newSection = {
        sectionName: "New Section",
      };
  
      $scope.sections.push(newSection);
    };

    // $scope.logout = function(){
    //   $http.get("/") 
    //   .then(function(response){
    //     console.log(response)
    //   })
    // }
  });
  
  myApp.controller('mainController', function($scope, $http, $location,) {
    $scope.logout = function (){
      
    }
  });
  
  myApp.controller('addController',function($scope){
    $scope.groceries = [];
  
    $scope.addgrocery = function() {
      var newGrocery = {
        groceryName: "New grocery",
      };
  
      $scope.groceries.push(newGrocery);
    };
  })