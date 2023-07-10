let data = JSON.parse(localStorage.getItem("id")) || {};
  let login = data.login;
  console.log(data.login)

  if(data.login==""){
    window.location.assign('http://127.0.0.1:5500/')
  }

  let users = data[login] || [];
  users.name=atob(users.name)
  users.email=atob(users.email)
  const list = document.createElement("ul");
  
  for (const i in users) {
    const value = users[i];
    const add = document.createElement("li"); 
    if (typeof value === 'object') {
      const list_1 = document.createElement("ul");
      for (const j in value) {
        const value_1 = value[j];
        const add_1 = document.createElement("li");
        if(typeof value_1 == 'object'){
        break;
        } 
        add_1.innerText = `${j}: ${value_1}`;
        list_1.appendChild(add_1);  
      }
      add.innerText = `${i}:`;
      if(`${i}` == 'img'){
        break;
      }
      add.appendChild(list_1);
    }
    else {
    add.innerText = `${i}: ${value}`;
  }
  list.appendChild(add);
  }
const cover=document.getElementById('disk')
cover.appendChild(list)

function go() {
  let url = document.getElementById("url").value;
  isimage(url);
}

function isimage(url) {
  let img = new Image();
  img.src = url;
  img.onload = function () {
    setimage(url);
    addimage(url);
  };
  img.onerror = function () {
    alert('URL is not an image');
  };
}
function setimage(url) {
  let data = JSON.parse(localStorage.getItem("id")) || {};
  let login = data.login;
  let users = data[login] || {};
  if(!users.img){
    users.img=[];
  }
  let obj=users.img || []
  if (!Array.isArray(obj)) {
    obj = [obj];
  }
  let add ={added:""}
  add.added=url
  obj.push(add)
  localStorage.setItem("id", JSON.stringify(data));
  location.reload();
}

function addimage(show , div,index) {
  let showimage = document.createElement('img');
  showimage.src = show;
  showimage.classList.add('images');
  let div_2 = document.createElement('div')
  let removebutton = document.createElement('button');
  let editbutton = document.createElement('button');
  removebutton.innerText = 'REMOVE';
  removebutton.addEventListener("click", () => {
    removeimage(show,div,index);
  });
  editbutton.innerText = 'EDIT';
  editbutton.addEventListener("click", () => {
    onfocus(show);
  });
  editbutton.classList.add('button_1');
  removebutton.classList.add('button_1');
  
  let add = document.getElementById('add');
  div.appendChild(showimage);
  div_2.appendChild(removebutton);
  div_2.appendChild(editbutton);
  div.appendChild(div_2)
  add.appendChild(div);
}

function onfocus(url) {
  document.getElementById('url').focus();
  const but=document.getElementById('search')
  but.innerText='REPLACE'
  but.removeEventListener('onclick',()=>{ 
    addimage(url)
  })
  but.addEventListener('click',() =>{
    editimage(url)
  })
}

function back(){
  document.getElementById("back").blur();
  const but=document.getElementById('search')
  but.innerText='SEARCH'
  but.addEventListener('onclick',()=>{ 
    addimage(url)
  })
  but.removeEventListener('click',() =>{
    editimage(url)
  })
}

function editimage(url){
  back()
  const newurl = document.getElementById('url').value;
  let data = JSON.parse(localStorage.getItem("id"));
  let login = data.login;
  let users = data[login];
  let user = users.img;
 
   for (i in user){
    let put =user[i]

    if(put.added == url){
      delete put.added

      if(newurl !== url){
        put.added = newurl
      }
      break;
    }
   }
  localStorage.setItem("id", JSON.stringify(data));
    console.log(data);
  location.reload();
}

function removeimage(show,div,index) {
  let data = JSON.parse(localStorage.getItem("id"));
  let login = data.login;
  let users = data[login];
  let user = users.img;

  for(let i in user){
    let put = user[i];

    if (put.added === show) {
      put.removed = put.added;
      delete put.added;
      
      for (let j = 0; j < div; j++) {
        let element=document.getElementsByClassName('images')
        element.src=show
        let i = element.src;
        if (element.indexOf(i) === index) {
          let del = index.parentNode;
          del.remove();
          break;
        }
      }

      break;
    }
  }

  localStorage.setItem("id", JSON.stringify(data));
  location.reload();
}

window.onload = function () {
  let data = JSON.parse(localStorage.getItem("id")) || {};
  let login = data.login;
  let users = data[login] || {};
  let images = users.img || [];
  let div = document.getElementById('pics');
  for (let index in images) {
    let put = images[index];
    if (put.hasOwnProperty('added')) {
      let show = put.added;
      console.log(index)
      addimage(show, div,index);
    }
  }
};

function logout() {
  let data = JSON.parse(localStorage.getItem("id")) || {};
  console.log(data)
    data.login="";
    localStorage.setItem('id',JSON.stringify(data))
  console.log(login)  
  window.location.assign('http://127.0.0.1:5500/');
}

document.getElementById('search').onclick = function (event) {
  event.preventDefault();
  go();
};
