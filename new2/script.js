var stored = [];
document.getElementById("data").style.visibility="hidden"
document.getElementById("load").style.visibility = "hidden";
document.getElementById("go_back").style.visibility = "hidden";
getData();

async function getData() {
  const url = 'https://jsonplaceholder.typicode.com/users';
  const response = await fetch(url);
  const value = await response.json();
  stored = value;
  document.getElementById("loader").style.display = "none";
  document.getElementById("load").style.visibility = "visible";

const id = localStorage.getItem("data");
if (id) {
  const found = stored.find(user => user.id === parseInt(id));
  if (found) {
    details(found);
    document.getElementById("go_back").style.visibility = "visible";
    document.getElementById("data").style.visibility="visible";
    }
  }
}

function submit() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const found = stored.find(login => login.email === email && login.username === password);

  if (found) {
    details(found);
    document.getElementById("go_back").style.visibility = "visible";
    localStorage.setItem("data", found.id);
    document.getElementById("data").style.visibility="visible";
  } 
  else if (stored.find(login => login.email !== email && login.username === password) || stored.find(login => login.email === email && login.username !== password)) {
    alert("Wrong details");
    return;
  } 
  else {
  alert("Invalid user");
  return;
  }
}

function details(found) {
  const list = document.createElement("ul");
  for (const i in found) {
    const value = found[i];
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
      add.appendChild(list_1);
    }
    else {
    add.innerText = `${i}: ${value}`;
  }
  list.appendChild(add);
}

const cover = document.getElementById("data");
cover.innerHTML = "USER DETAILS";
cover.appendChild(list);
}

function back() {
  document.getElementById("load").style.visibility = "visible";
  document.getElementById("go_back").style.visibility = "hidden";
  location.reload();
  localStorage.clear();
}

document.getElementById("Form").onsubmit = function(event) {
  event.preventDefault();
  submit();
};
