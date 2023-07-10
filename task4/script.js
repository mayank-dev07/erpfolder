let myApp=angular.module("myModule",[])

myApp.controller("myController",function($scope){
    $scope.List=JSON.parse(localStorage.getItem("data")) || [];
    
    $scope.addTodo = () => {
        if($scope.newTodo){
            let Todo = {
                text: $scope.newTodo,
                time: new Date(),
                status: "added"
            }

            $scope.List.push(Todo);
            $scope.newTodo='';
            localStorage.setItem("data",JSON.stringify($scope.List));
        }
    }
    
    $scope.remove = function(index){
        $scope.List[index].status = "removed";
        localStorage.setItem("data",JSON.stringify($scope.List));  
    }

    $scope.complete = function(index){
        $scope.List[index].status = "completed";
        localStorage.setItem("data",JSON.stringify($scope.List));  
    }

    $scope.showRow = function (index) {
        return $scope.List[index].status == "added";
    };
    
    $scope.edit=function(index){
        if($scope.newTodo){
            $scope.List[index].text = $scope.newTodo;
            $scope.List[index].time = new Date();
            $scope.newTodo='';
            localStorage.setItem("data",JSON.stringify($scope.List));
        }
        else{
            alert("THERE IS NOTHING TO EDIT")
        }
    }
});
