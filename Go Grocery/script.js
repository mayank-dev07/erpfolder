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
  .state('editSection',{
    url: '/editSection',
    templateUrl: 'editSection.html',
    controller: 'editSectionController'
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
      $location.path('/manager');
    };

    $scope.back = function(){
    $location.path('/manager');
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
  
 
  myApp.service('sharedDataService', function() {
    var sectionId;

    this.setSectionId = function(id) {
        sectionId = id;
    };

    this.getSectionId = function() {
        return sectionId;
    };
});


  myApp.controller('managerController', ['$scope', '$http', '$location','$window','sharedDataService', function($scope, $http, $location, $window,sharedDataService) {
    $http.get(apiUrl + '/section', {withCredentials: true})
    
	  .then(function(response){
      $scope.sections = [];
      console.log(response);
      let sectionDetails = response.data;
      $scope.sections = sectionDetails;
      console.log($scope.sections)
    })

	  .catch(function(error){
      console.log(error)
	 })

      $scope.deleteSection = function(sectionId){
        let data = {
          name: sectionId
        }
        console.log(data)
        $http.post(apiUrl + '/deletesection', data, {withCredentials: true})

        .then(function(response){
          console.log(response)
          $window.alert(response.data.message)
        })
        .catch(function(error){
          console.log(error)
        })
      } 
        
      $scope.addProduct = function(sectionId) {
        sharedDataService.setSectionId(sectionId);
        console.log(sectionId)
        $location.path('/products');
    };
    

          $scope.addSection = function(){
          $location.path('/section')
        }

          $scope.editSection = function(sectionId){
            // let data = {
            //   id: sectionId
            // }
            // console.log(data)
            // $http.post(apiUrl + '/editsection', data, {withCredentials: true})

            // .then(function(response){
            //   console.log(response)
            //   $location.path('/editSection')
            // })
            // .catch(function(error){
            //   console.log(error)
            // })
        }
  }]);


  myApp.controller('productController',['$scope', '$http','$location','sharedDataService',function($scope,$http,$location,sharedDataService){
     
    $scope.submitForm = function() {
      var sectionId = sharedDataService.getSectionId();
      var file = $scope.formData.image;
      var name = $scope.formData.name;
      var price = $scope.formData.price;
      var mfd = formatDate($scope.formData.mfd);
      var exp = formatDate($scope.formData.exp);
      // var description = $scope.formData.description;
      
      var formData = new FormData();
      formData.append('productImage', file);  
      formData.append('product', name);
      formData.append('id', sectionId);
      formData.append('price', price);
      formData.append('mfdate', mfd);
      formData.append('expdate', exp);
      // formData.append('productDescription', description);
      console.log(formData)
      
      $http.post(apiUrl + "/product", formData, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined },
        withCredentials: true
      })
      .then(function(response) {
        console.log('Data uploaded successfully');
        console.log(response)
        $location.path('/manager');
      })
      .catch(function(error) {
        console.error('Error uploading data:', error);
      });
    };   
    function formatDate(dateString) {
      var date = new Date(dateString);
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } 

    $scope.back = function(){
      $location.path('/manager');
      }

  }]);
  
myApp.controller('displayProductController', ['$scope', '$http',  '$window', function($scope, $http,$window) {
    // var sectionId =sectionId;

    // $scope.products = [];
    // $http.get(apiUrl + '/product', { withCredentials: true })
    //     .then(function(response) {
    //         $scope.products = response.data;
    //         console.log($scope.products);
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //         $window.alert("Error fetching products");
    //     });
}]);

  
myApp.controller('editSectionController', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
  
  $scope.submitForm = function(){
    let edit = {
      name: $scope.formData.name,
      image: $scope.formData.image 
    }

    console.log(edit)
    $http.post(apiUrl + '/editsection' , edit , {withCredentials: true})
    .then(function(response){
      console.log(response)
    })
  }

  $scope.back = function(){
    $location.path('/manager')
  }
}]); 
  
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


    myApp.controller('mainController', ['$scope', '$http', '$location','$state', function($scope, $http, $location,$state) {
      $scope.products=[];
      $http.get(apiUrl + '/product', {withCredentials : true})
      .then(function(response){
        console.log(response)
        $scope.products = response.data;
        console.log($scope.products)
      })
      .catch(function(error){
        console.log(error)
      })

      $scope.Modal = false;
  
      $scope.details = function(productId) {
        console.log(productId)
        $http.get(apiUrl + '/product', {withCredentials: true})
        .then(function(response){
          $scope.selectedProduct = response.data;
          $scope.Modal = true;
        })
      };
  
      $scope.closeModal = function() {
          $scope.Modal = false;
      };

      $scope.logout = function() {
        $http.get( apiUrl + ' ', {withCredentials: true})
        .then(function(response){
          console.log(response)

          if(response.data == " "){
            Swal.fire({
                icon: 'success',
                title: 'You are logged out',
                confirmButtonText: 'ok'
            })
            .then(function(result) {
              console.log(result)
                if (result.isConfirmed) {
                    console.log(result.isConfirmed)
                    $scope.$apply(function(){
                      $location.path('/login') 
                    });
                  }
                });
          }
        })
    };
    
  }]);
  

  myApp.controller('addController',['$scope','$http',function($scope,$http){
    $scope.groceries = [];
    
    $http.get(apiUrl + '/', {withCredentials: true})
    .then(function(response){
      console.log(response)
      $scope.groceries = response.data;
    })
    .catch(function(error){
      console.log(error)
    })

    $scope.addgrocery = function() {
      var newGrocery = {
        groceryName: "New grocery",
        groceryPrice: "990"
      };
  
      $scope.groceries.push(newGrocery);
    };
  }]);
 
