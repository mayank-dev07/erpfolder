  var myApp = angular.module('myModule', ['ui.router']);

  myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('main',{
      url:'/main',
      templateUrl: '/html/main.html',
      controller: 'mainController'
    })
    .state('login',{
      url:'/login',
      templateUrl: '/html/login.html',
      controller: 'loginController'
    })
    .state('manager',{
      url: '/manager',
      templateUrl: '/html/manager.html',
      controller: 'managerController'
    })
    .state('add',{
      url: '/add',
      templateUrl: '/html/add.html',
      controller: 'addController'
    })
    .state('section',{
      url: '/section',
      templateUrl: '/html/section.html',
      controller: 'sectionController'
    })
    .state('register',{
      url: '/register',
      templateUrl: '/html/register.html',
      controller: 'registerController'
    })
    .state('products',{
      url: '/products',
      templateUrl: '/html/products.html',
      controller: 'productController'
    })
    .state('displayProducts',{
      url: '/displayProducts',
      templateUrl: '/html/displayProducts.html',
      controller: 'displayProductController'
    })
    .state('editSection',{
      url: '/editSection',
      templateUrl: '/html/editSection.html',
      controller: 'editSectionController'
    })
    .state('editProduct',{
      url: '/editProduct',
      templateUrl: '/html/editProduct.html',
      controller: 'editproductController'
    })
    $urlRouterProvider.otherwise('/login');
  }]);


  const apiUrl = "https://10.21.84.138:8000";


  myApp.controller('registerController',['$scope','$http','$location','$window' , function($scope, $http, $location,$window) {
    $scope.registeration = function() {
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
        else if(manage === "Invalid login"){
          $window.alert("Invalid login")
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
        
        console.log(formData)

        $http.post(apiUrl + "/section", formData, {
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
      var sharedData = {};
    
      return {
        getSectionId: function() {
          return sharedData;
        },
        setSectionId: function(data) {
          sharedData = data;
        }
      };
    });
    

  function getSections($http, apiUrl, successCallback, errorCallback) {
    $http.get(apiUrl + '/section', { withCredentials: true })
      .then(successCallback)
      .catch(errorCallback);
  }

  var SectionId =null;

    myApp.controller('managerController', ['$scope', '$http', '$location','$window','sharedDataService', function($scope, $http, $location, $window,sharedDataService) {
      getSections($http, apiUrl, function(response) {
        $scope.sections = response.data;
        console.log($scope.sections);
      }, function(error) {
        console.log(error);
      });

        $scope.deleteSection = function(sectionId){
          console.log(sectionId)
          let data = {
            name: sectionId
          }
          console.log(data)
          $http.post(apiUrl + '/deletesection', data, {
            withCredentials: true
          })

          .then(function(response){
            console.log(response)
            $window.alert(response.data.message)
            getSections($http, apiUrl, function(response) {
            $scope.sections = response.data;
            console.log(response.data)
          }, function(error) {
            console.log(error);
          });
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

          $scope.editSection = function(sectionId) {
            console.log(sectionId);
            SectionId = sectionId
            $location.path('/editSection');
          }
          
    }]);


    myApp.controller('productController',['$scope', '$http','$location','sharedDataService','$window',function($scope,$http,$location,sharedDataService, $window){
      
      $scope.submitForm = function() {
        var sectionId = sharedDataService.getSectionId();
        var quantity = $scope.formData.quantity
        var file = $scope.formData.image;
        var name = $scope.formData.name;
        var price = $scope.formData.price;
        var mfd = formatDate($scope.formData.mfd);
        var exp = formatDate($scope.formData.exp);
        // var description = $scope.formData.description;
        
        var formData = new FormData();
        formData.append('productImage', file);  
        formData.append('qt', quantity);  
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
          console.log(response)
          $window.alert(response.data.message)
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
    
    function getProducts($scope, $http, $window, apiUrl) {
      $scope.products = [];
    
      $http.get(apiUrl + '/product', {withCredentials: true})
        .then(function(response) {
          $scope.products = response.data;
          console.log($scope.products);
        })
        .catch(function(error) {
          console.log(error);
          $window.alert("Error fetching products");
        });
    }
    
var EditProduct = null;

  myApp.controller('displayProductController', ['$scope', '$http',  '$window', '$location', function($scope, $http,$window, $location) {
    getProducts($scope, $http, $window, apiUrl);

          $scope.delete = function(productId){
            let data ={
              id: productId
            }
            console.log(data)
            $http.post(apiUrl + '/deleteproduct' , data , {
              withCredentials: true
            })
            .then(function(response){
              console.log(response)
              getProducts($scope, $http, $window, apiUrl);
            })
          }
      
          $scope.edit = function(productId){
            console.log(productId)
            EditProduct = productId;
            $location.path('/editProduct')
          }
  }]);


  myApp.controller('editSectionController', ['$scope', '$http', '$location', '$window', 'sharedDataService', function($scope, $http, $location, $window, sharedDataService) {
    var sectionId = SectionId;
    
    $scope.submitForm = function() {
      var formData = new FormData();
      var file = $scope.formData.image;
      var name = $scope.formData.name;
      
      formData.append("id", sectionId);
      formData.append("name", name);
      formData.append("image", file);
  
      console.log(formData);
  
      $http.post(apiUrl + '/editsection', formData, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined },
        withCredentials: true
      })
      .then(function(response) {
        console.log(response.data);
        $window.alert(response.data.message)
        $location.path('/manager')
      })
      .catch(function(error){
        console.log(error)
      })
    }

    $scope.back = function (){
      $location.path('/manager')
    }

  }]);
  

      myApp.controller('mainController', ['$scope', '$http', '$location','$window', function($scope, $http, $location,$window) {
        $scope.products = [];
        $scope.selectedProduct = {};
        $http.get(apiUrl + '/product', {
          withCredentials : true
        })
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
          console.log(productId);
          $http.get(apiUrl + '/product', { withCredentials: true })
            .then(function(response) {
              console.log(response.data);
              $scope.selectedProduct = response.data;
              console.log($scope.selectedProduct)
              let show = null;
              for (var i = 0; i < $scope.selectedProduct.length; i++) {
                if ($scope.selectedProduct[i].id === productId) {
                  show = $scope.selectedProduct[i];
                  break;
                }
              }
              if (show) {
                $scope.selectedProduct = show;
                $scope.Modal = true;
              } 
            });
        };
        
        $scope.add = function(productId){
          console.log(productId)
          let data = {
            productid: productId
          }
          console.log(data)
          $http.post(apiUrl + '/addtocart', data, {
            withCredentials:true
          })
          .then(function(response){
            console.log(response)
            $window.alert(response.data.message)
          })
          .catch(function(error){
            console.log(error)
          })
        }

        $scope.closeModal = function() {
            $scope.Modal = false;
        };

        $scope.logout = function() {
          $http.get( apiUrl + '/logout', {
            withCredentials: true
          })
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

        $scope.buy = function(productid){
          console.log(productid)
          let data ={
            id:productid
          }
          console.log(data)
          $http.post(apiUrl + '/buynow', data, {
            withCredentials: true
          })
          .then(function(response){
            console.log(response)
            $window.alert(response.data.message)
          })
        }
    }]);

    function getGroceries($scope, $http, apiUrl,$window,$location ) {
      $scope.groceries = [];
      $scope.totalamount = 0;
      
      $http.get(apiUrl + '/cartview', { withCredentials: true })
        .then(function(response) {
          console.log(response)
          console.log(response.data.NETAMOUNT)
          $scope.totalamount = response.data.NETAMOUNT;
          if($scope.totalamount == "0"){
            $window.alert("The cart is empty")
            $location.path('/main')
          }
          $scope.groceries = response.data.productsdata;
          console.log($scope.groceries);
        })
        .catch(function(error) {
          console.log(error);
        });
      }


      myApp.controller('addController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
        getGroceries($scope, $http, apiUrl, $window, $location);
        $scope.remove = function(productId) {
          console.log(productId)
          let data = {
            id: productId
          };
          console.log(data)
      
          $http.post(apiUrl + "/removefromcart", data, {
            withCredentials: true
          })
          .then(function(response) {
            console.log(response);
            getGroceries($scope, $http, apiUrl,$window, $location);
          })
          .catch(function(error) {
            console.log(error);
          });
        }
      
        $scope.decrementQuantity = function(grocery) {
          if (grocery.quantity > 1) {
            grocery.quantity -= 1;
            sendQuantityUpdate(grocery);
            console.log(grocery.productid)
          }
        };
      
        $scope.incrementQuantity = function(grocery) {
          grocery.quantity += 1;
          sendQuantityUpdate(grocery);
        };
      
        function sendQuantityUpdate(grocery) {
          let data = {
            productid: grocery.productid,
            quantity: grocery.quantity
          };
          
          console.log(data)
      
          $http.post(apiUrl + "/qtyinc", data, {
            withCredentials: true
          })
          .then(function(response) {
            console.log(response);
            getGroceries($scope, $http, apiUrl, $location , $window);
          })
          .catch(function(error) {
            console.log(error);
          });
        }
      
        $scope.addgrocery = function(){
          $location.path('/main')
        }
      
      $scope.buy = function(){
        $http.get(apiUrl + '/buycart' ,{ withCredentials: true})
        .then(function(response){
          console.log(response)
          console.log(response.data.message)
          $window.alert(response.data.message)
          $location.path('/main')
        })
      }
      
      }]);
      


myApp.controller('editproductController', ['$scope', '$http', '$location','$window', function($scope, $http, $location,$window  ) {

  var productId = EditProduct;
    
  $scope.submitForm = function() {
    var formData = new FormData();
    var file = $scope.formData.image;
    var name = $scope.formData.name;
    var price = $scope.formData.price;
    var mfd = formatDate($scope.formData.mfd);
    var exp = formatDate($scope.formData.exp);
    
    formData.append("id", productId);
    formData.append("name", name);
    formData.append("image", file);
    formData.append('price', price);
    formData.append('date1', mfd);
    formData.append('date2', exp);

    console.log(formData);

    $http.post(apiUrl + '/editproduct', formData, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined },
      withCredentials: true
    })
    .then(function(response) {
      console.log(response.data.message);
      $window.alert(response.data.message)
      $location.path('/displayProducts')
    })
    .catch(function(error){
      console.log(error)
    })
  }

  function formatDate(dateString) {
    var date = new Date(dateString);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } 
  
  $scope.back = function(){
    $location.path('/displayProducts')
  }

}]);