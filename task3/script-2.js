let data = JSON.parse(localStorage.getItem("id")) || {};
let login = data.login;
console.log(data.login);

if (data.login === "") {
  window.location.assign('http://127.0.0.1:5500/');
}

let users = data[login] || [];
users.name = atob(users.name);
users.email = atob(users.email);
const list = document.createElement("ul");

for (const i in users) {
  const value = users[i];
  const add = document.createElement("li");
  if (typeof value === 'object') {
    const list_1 = document.createElement("ul");
    for (const j in value) {
      const value_1 = value[j];
      const add_1 = document.createElement("li");
      if (typeof value_1 === 'object') {
        break;
      }
      add_1.innerText = `${j}: ${value_1}`;
      list_1.appendChild(add_1);
    }
    add.innerText = `${i}:`;
    if (i === 'img') {
      break;
    }
    add.appendChild(list_1);
  } else {
    add.innerText = `${i}: ${value}`;
  }
  list.appendChild(add);
}
const cover = document.getElementById('disk');
cover.appendChild(list);

function go() {
  let url = document.getElementById('url').value;
  isImgUrl(url);
}

async function isImgUrl(url) {
  const img = new Image();
  img.src = url;

  return new Promise((resolve) => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  }).then((isImage) => {
    if (isImage) {
      setImages(url);
      addImages();
    }
    else{
      alert("invalid url")
    }
  });
}

function setImages(url){
  let data = JSON.parse(localStorage.getItem("id")) || {};
  let login = data.login;
  let user = data[login];

  if(!user.img){
    user.img = [];
  }

  let obj = user.img;
  let add = { added : url };
  obj.push(add);
  localStorage.setItem("id", JSON.stringify(data));
}

function addImages(){
  let data = JSON.parse(localStorage.getItem("id")) || {};
  let login = data.login;
  let user = data[login];

  if(user.img){
    const show = document.getElementById("add");
    show.innerHTML="";
    let value = user.img
    value.forEach((element ,index) => {
      if (element.removed) {
        return;
      }
      const imageContainer = document.createElement('div');
      const image = document.createElement('img');
      
      image.src = element.added
      image.classList.add('img')
      image.dataset.index = index;
      console.log(image);

      const Button = document.createElement('div');
      Button.classList.add('button-container')
      const removeButton = document.createElement('button');
      removeButton.addEventListener("click" , ()=>{
        removeimage(index);
      });
      const editButton = document.createElement('button');
      editButton.addEventListener("click" , ()=>{
        editimage(index);
      });
      removeButton.innerText = 'Remove';
      editButton.innerText = 'Edit';

      Button.appendChild(removeButton);
      Button.appendChild(editButton);
      imageContainer.appendChild(image);
      imageContainer.appendChild(Button);
      show.appendChild(imageContainer)
    });
  }
}

function removeimage(index){
  let data = JSON.parse(localStorage.getItem("id")) || {};
  let login = data.login;
  let user = data[login];

  if(user.img){
    let value = user.img;
    value[index].removed = value[index].added;
    delete value[index].added;
  }
  
  localStorage.setItem('id', JSON.stringify(data));
  addImages();
}

function editimage(index){
  let data = JSON.parse(localStorage.getItem("id")) || {};
  let login = data.login;
  let user = data[login];
  
  if(user.img){
    let url = document.getElementById('url').value;
    let value = user.img
    value[index].added = url;
    console.log(value[index].added)
  }
  localStorage.setItem('id', JSON.stringify(data))
  addImages()
}

function logout() {
  let data = JSON.parse(localStorage.getItem("id")) || {};
  console.log(data)
    data.login="";
    localStorage.setItem('id',JSON.stringify(data))
  console.log(login)  
  window.location.assign('http://127.0.0.1:5500/');
}

window.addEventListener('load', addImages);
