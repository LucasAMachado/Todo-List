const todoForm = document.querySelector('#todo-form');
const todoInput = todoForm.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const clearBtn = document.querySelector('.clear-btn');
const filter = document.querySelector('.form-input-filter');
const filterBox = document.querySelector('.filter');
const bodyDiv = document.querySelector('.body-div');
const exitEditModeBtn = document.querySelector('.close');
const editBtn = document.querySelector('.edit-button');
const editPopUp = document.querySelector('.edit-task-popup');
const editConfirmBtn = document.querySelector('#confirm-edit-btn');

// Function to display the items form localStorage
function displayItems() {
    const itemsfromLocalStorage = getItemsFromLocalStorage();

    if (itemsfromLocalStorage.length === 0) {
        bodyDiv.style.display = 'none';
    } else {
        bodyDiv.style.display = 'block';
    }

    todoList.innerHTML = '';

    itemsfromLocalStorage.forEach((item) => {
        addItemToDOM(item);
    });
}

// Function to add an item to the to do list
function onClickAddItem(e) {
    e.preventDefault();

    const todoValue = todoInput.value;

    if (todoValue === "" || /^\s+$/.test(todoValue)) {
        alert("You must enter a task.");
        return;
    }

    if (confirm('Are you Sure')) {
        addItemToDOM(todoValue);
        addItemToLocalStorage(todoValue);
        todoInput.value = '';
        updateUI();
    }
}

// Function to create a to do list button
function createBtn() {
    const newBtn = document.createElement('button');
    const xValue = document.createElement('span');
    const xTextNode = document.createTextNode('X');

    newBtn.className = "remove-button";
    xValue.className = "remove-icon";
    xValue.appendChild(xTextNode);


    newBtn.appendChild(xValue);
    return newBtn;
}

// Function to create edit button
function createEditBtn() {
    const newBtn = document.createElement('button');
    const editValue = document.createElement('span');
    const editTextNode = document.createTextNode('Edit');

    newBtn.className = "edit-button";
    editValue.className = "edit-icon";
    editValue.appendChild(editTextNode);


    newBtn.appendChild(editValue);
    return newBtn;
}

// Function to add item to DOM
function addItemToDOM(item) {
    const li = document.createElement('li');
    const textNode = document.createTextNode(item);

    li.className = "list-item";

    const button = createBtn();
    const editButton = createEditBtn();

    li.appendChild(textNode);
    li.appendChild(button);
    li.appendChild(editButton);

    todoList.appendChild(li);
}

// Function to add item to local storage
function addItemToLocalStorage(item) {
    const itemsInLocalStorage = getItemsFromLocalStorage();


    itemsInLocalStorage.push(item);

    localStorage.setItem('tasks', JSON.stringify(itemsInLocalStorage));

}

// Function to remove item from local storage
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromLocalStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set to localStorage
    localStorage.setItem('tasks', JSON.stringify(itemsFromStorage));
}

// Function to get items from local storage
function getItemsFromLocalStorage() {
    let itemsInLocalStorage;

    if (localStorage.getItem('tasks') === null) {
        itemsInLocalStorage = [];
    } else {
        itemsInLocalStorage = JSON.parse(localStorage.getItem('tasks'));
    }

    return itemsInLocalStorage;
}

// Function to delete items 
function onClickDeleteItem(e) {
    if (e.target.parentElement.classList.contains('remove-button')) {
        removeItem(e.target.parentElement.parentElement);
    }
}

// Function to remove item
function removeItem(item) {
    const taskText = item.firstChild.textContent;

    if (confirm('Are you sure?')) {
        item.remove();
        removeItemFromStorage(taskText);
        updateUI();
    }
}

// Function to clear all of the items
function onClickClearAll() {
    let itemsfromLocalStorage = getItemsFromLocalStorage();

    if (confirm('Are you sure?')) {
        itemsfromLocalStorage.forEach((item) => {
            removeItemFromStorage(item);
        })

        updateUI();
    }
}

// Function to filter out tasks
function filterTasks(e) {
    let filterValue = e.target.value.toLowerCase();
    const items = document.querySelectorAll('li');

    items.forEach((item) => {
        let itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(filterValue) === -1) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
        }
    });
}

// Function to exit the edit mode
function exitEditMode(e) {
    e.target.parentElement.parentElement.style.display = 'none'
}

todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-button')) {
        onClickEdit(e);
    }
});

// Function to edit tasks on click
function onClickEdit(e) {
    const editPopUp = document.querySelector('.edit-task-popup');
    const taskItem = e.target.parentElement;
    const taskText = taskItem.firstChild.textContent;
    const newTaskNameInput = document.querySelector('#new-task-name');

    newTaskNameInput.value = taskText;
    editPopUp.style.display = '';
    editPopUp.dataset.taskId = taskText; // Store the task ID in a custom data attribute
}

// Function to confirm the new item edit
function onClickConfirmEdit(e) {
    const editPopUp = document.querySelector('.edit-task-popup');
    const newTaskName = document.querySelector('#new-task-name').value;
    const taskId = editPopUp.dataset.taskId; // Retrieve the task ID
    const taskItems = document.querySelectorAll('.list-item');
    let taskItemToUpdate;

    // Find the task item to update
    taskItems.forEach(item => {
        if (item.firstChild.textContent === taskId) {
            taskItemToUpdate = item;
        }
    });

    if (newTaskName !== "") {
        taskItemToUpdate.firstChild.textContent = newTaskName;
        updateTaskInLocalStorage(taskId, newTaskName);
        editPopUp.style.display = 'none';
    } else {
        alert("You must enter a new task name.");
    }
}

// Function to update the task name in local storage
function updateTaskInLocalStorage(oldName, newName) {
    let itemsFromStorage = getItemsFromLocalStorage();
    const index = itemsFromStorage.indexOf(oldName);

    if (index !== -1) {
        itemsFromStorage[index] = newName;
        localStorage.setItem('tasks', JSON.stringify(itemsFromStorage));
    }
}

// Function to update the UI
function updateUI() {
    // Event listeners 
    todoForm.addEventListener('submit', onClickAddItem);
    todoList.addEventListener('click', onClickDeleteItem);
    clearBtn.addEventListener('click', onClickClearAll);
    filter.addEventListener('input', filterTasks);
    exitEditModeBtn.addEventListener('click', exitEditMode);
    editConfirmBtn.addEventListener('click', onClickConfirmEdit);
    displayItems();

}

updateUI();

