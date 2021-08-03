// ********** Select Items ************

const form = document.querySelector(".list-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
const copyBtn = document.querySelector(".copy-btn");

// edit option

let editElement;
let editFlag = false;
let editID = "";

// **************** Event Listener ****************

// submit form
form.addEventListener("submit", addItem);

// clear list
clearBtn.addEventListener("click", clearItems);

// copy list to clipboard
copyBtn.addEventListener("click", copyItems);

// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ************* funtions *************************

// add item
function addItem(e) {
  e.preventDefault();

  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);
    // display alert
    displayAlert("Item Added Succesfully", "success");
    // show grocery container
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Item Edited Successfully", "success");
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Please Enter Value", "danger");
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }

  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// delete Item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Item Removed", "danger");
  removeFromLocalStorage(id);
  setBackToDefault();
}
// edit Item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;

  // set form value
  grocery.value = editElement.innerHTML;
  console.log((grocery.value = editElement.innerHTML));

  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}

// copy lists to clipboard
function copyItems() {
  let items = getLocalStorage();
  items = items
    .map((item) => {
      let itemValue = item.value;
      itemValue = itemValue
        .toLowerCase()
        .split(" ")
        .map(
          (itemValue) =>
            itemValue.charAt(0).toUpperCase() + itemValue.substring(1)
        )
        .join(" ");

      return itemValue;
    })
    .join(", ");

  let item = document.createElement("textarea");
  document.body.appendChild(item);
  item.value = items;
  item.select();
  document.execCommand("copy");
  document.body.removeChild(item);
  displayAlert("Item has copied to clipboard", "success");
  setBackToDefault();
}

// set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ******************* Local Storage *********************
// add to the local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// delete from local sotrage
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// edit value to the local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }

    return item;
  });

  localStorage.setItem("list", JSON.stringify(items));
}

// ************* setup items *************
function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });

    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="submit" class=" edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="submit" class=" delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;

  // add event listner to both button
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}
