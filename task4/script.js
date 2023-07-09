let myApp=angular.module("myModule",[])

myApp.controller("myController",function($scope){
    $scope.List=JSON.parse(localStorage.getItem("data")) || [];
    
    $scope.addTodo=()=>{
        if($scope.newTodo){
            let Todo = {
                text: $scope.newTodo,
                time: new Date()
            }
            $scope.List.push(Todo);
            $scope.newTodo='';
            localStorage.setItem("data",JSON.stringify($scope.List));
        }
    }

    $scope.remove=function(index){
        $scope.List.splice(index,1);
        localStorage.setItem("data",JSON.stringify($scope.List));
        
    }
    
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
})

