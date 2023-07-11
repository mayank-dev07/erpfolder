window.onload=()=>{
  let data =JSON.parse(localStorage.getItem("id")) ||{}
  let login=data.login
  if(login !== ""){
    window.location.assign('http://127.0.0.1:5500/details.html')
  }
}


var stored = [];
getdata();
async function getdata() {
  const url = 'https://jsonplaceholder.typicode.com/users';
  const response = await fetch(url);
  const value = await response.json();
  stored = value;
}
function submit() {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let found = stored.find((user) => user.email === email && user.username === password);
  if (found) {
    let id=found.id;
    let data =JSON.parse(localStorage.getItem('id')) || {};

    for(let i in data){
      if(i==found.id){
        data.login=found.id
        console.log(data.login)
        localStorage.setItem("id", JSON.stringify(data));
        window.location.assign('http://127.0.0.1:5500/details.html');
        return;
        }
      } 

    if( id === data.login ){
      window.location.assign('http://127.0.0.1:5500/details.html');
      return;
    }
      else{
      details(found);
    }

  }
  else{
    alert("invalid user")
  }

}

function details(found){
  let user={};
  user.login=found.id
  let present=JSON.parse(localStorage.getItem("id")) || {}
  present[found.id]=found;
  found.name=btoa(found.name)
  found.email=btoa(found.email)
  let data ={...present,...user}
  localStorage.setItem("id", JSON.stringify(data));
  window.location.assign('http://127.0.0.1:5500/details.html')
  }

// function signin(){
//   window.location.assign("")
// }

document.getElementById('Form').onsubmit = function (event) {
  event.preventDefault();
  submit();
};
