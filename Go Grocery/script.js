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
  .state('products',{
    url: '/products',
    templateUrl: 'products.html',
    controller: 'productController'
  })
  .state('displayProducts',{
    url: '/displayProducts',
    templateUrl: 'displayProducts.html',
    controller: 'displayProductController'
  })
  $urlRouterProvider.otherwise('/login');
}]);


const apiUrl = "https://10.21.84.138:8000"


myApp.controller('registerController',['$scope','$http','$location','$window' , function($scope, $http, $location,$window) {
  $scope.registeration = function (){
    let registered = {
      Username : $scope.registerationuserName,
      Password : $scope.registerationPassword,
      Confirmpassword : $scope.registerationConfirmPassword,
      Email : $scope.registerationEmail,
      Firstname : $scope.registerationfirstName,
      Lastname :$scope.registerationlastName
    }
    
    let pass = $scope.registerationPassword;
    let cp = $scope.registerationConfirmPassword;
    
    console.log(registered)
    
    if(pass === cp){
      $http.post(apiUrl + "/register",registered,{
        withCredentials: true
      })
      .then(function (response){
        console.log(response);
        $location.path('/login');
      })
      .catch(function(error){ 
        let err=error.data.message;
        console.log(err)
        if(err){
          $window.alert(err)
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
}]);


myApp.controller('loginController',['$scope','$http','$location','$window', function($scope, $http, $location, $window) {

  $scope.login = function (){
    let data = {
      Username: $scope.loginName,
      Password: $scope.loginPassword
    }

    console.log(data)
    
    $http.post(apiUrl + "/login1",data, {withCredentials: true})
    .then(function(response){
      console.log(response)
      let manage = response.data.message
      console.log(manage);

      if(manage === "Manager"){
        $location.path('/manager')
      }
      else if(manage === "Enter valid credentials"){
        $window.alert("Invalid user")
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
}]);


myApp.controller('sectionController', ['$scope', '$http', '$location', function($scope, $http , $location) {
    $scope.formData = {};
    
    $scope.submitForm = function() {
      var file = $scope.formData.image;
      var text = $scope.formData.text;
      
      var formData = new FormData();
      formData.append('sectionImage', file);  
      formData.append('sectionName', text);
      
      $http.post(apiUrl + "/section", formData, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined },
        withCredentials: true
      })
      .then(function(response) {
        console.log('Data uploaded successfully');
        console.log(response)
      })
      .catch(function(error) {
        console.error('Error uploading data:', error);
      });
    };

    $scope.back = function(){
      $location.path('/manager')
    }
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
  
  myApp.controller('managerController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.sections = [];
    $http.get(apiUrl + '/section', {withCredentials: true})
    
	  .then(function(response){
      console.log(response);
      let sectionDetails = response.data;
      $scope.sections = sectionDetails;
      $window.alert("section added successfully");
    })

	  .catch(function(error){
      if(error.data.message){
        $window.alert(error.data.message)
      }
      else{
        $window.alert("there is an error")
      }
	 })

   $scope.showProducts = function(sectionId) {
    $location.path('/displayProducts' + sectionId);
  };

    $scope.products = function(){
    $location.path('/products')
   } 

    $scope.addSection = function(){
      $location.path('/section')
    }
  }]);
  
  myApp.controller('displayProductController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    
    $scope.products = [];
    $http.get(apiUrl + "/product",{
    withCredentials: true
    })

    .then(function(response){
    console.log(response);
    let productDetails = response.data;
    console.log(productDetails)
    $scope.products = productDetails;
    $window.alert("product added successfully");
    })

    .catch(function(error){
    if(error.data.message){
    $window.alert(error.data.message)
    }
    else{
    $window.alert("there is an error")
    }
  })

    $scope.products = function(){
    $location.path('/products')
  } 
}]);


    myApp.controller('productController',['$scope',function($scope){
       
      $scope.submitForm = function() {
        var name = $scope.formData.name;
        var price = $scope.formData.price;
        var description = $scope.formData.description;
        var file = $scope.formData.image;
        
        var formData = new FormData();
        formData.append('productImage', file);  
        formData.append('productName', name);
        formData.append('productPrice', price);
        formData.append('productDescription', description);
        
        $http.post(apiUrl + "/product", formData, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined },
          withCredentials: true
        })
        .then(function(response) {
          console.log('Data uploaded successfully');
          console.log(response)
        })
        .catch(function(error) {
          console.error('Error uploading data:', error);
        });
      };    }]);
    
  
// myApp.controller('mainController', ['$scope', function($scope) {
//     $scope.products = [
//         {
//             name: "Apple",
//             price: 100,
//             image: "images/apple_158989157.jpg"
//         },
//         {
//             name: "Banana",
//             price: 50,
//             image: "images/photo-1571771894821-ce9b6c11b08e.avif"
//         }
//         // Add more products here
//     ];

//     $scope.showModal = false;

//     $scope.details = function(product) {
//         $scope.selectedProduct = product;
//         $scope.showModal = true;
//     };

//     $scope.closeModal = function() {
//         $scope.showModal = false;
//     };

//     $scope.add = function(product) {
//         // Add your logic for adding to cart here
//     };
// }]);


    myApp.controller('mainController', ['$scope', '$http', '$location', function($scope, $http, $location) {
      
    //    $scope.logout = function(){
    //   $http.get("/") 
    //   .then(function(response){
    //     console.log(response)
    //     $location.path('/login')
    //   })
    // }

      $scope.Modal = false;
  
      $scope.details = function(name, price) {
          $scope.selectedProductName = name;
          $scope.selectedProductPrice = price;
          $scope.Modal = true;
      };
  
      $scope.closeModal = function() {
          $scope.Modal = false;
      };
  }]);
  

  myApp.controller('addController',function($scope){
    $scope.groceries = [];
  
    $scope.addgrocery = function() {
      var newGrocery = {
        groceryName: "New grocery",
      };
  
      $scope.groceries.push(newGrocery);
    };
  })
  
