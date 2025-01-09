
const toDoList = document.querySelector(".toDoList");
const alertBox = document.querySelector("#alert");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function handleDeleteClick(event) {
    event.preventDefault();
    const id = event.target.closest('.delete-btn').dataset.id; 
    deleteTask(id); 
}

const toDoForm = document.querySelector("#toDoForm");


function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(toDoForm)
    const formObj = Object.fromEntries(formData);
    if (formObj.work == "") {
        alert("Boş alan bırakılamaz");
        return;
    }

    if (tasks.length === 0) {
        formObj.id = 1
    } else {
        formObj.id = tasks[tasks.length - 1].id + 1
    }
    tasks.push(formObj);
    localStorage.setItem(`tasks`, JSON.stringify(tasks));
    toDoForm.reset();
    render();
    TaskCount();
}

toDoForm.addEventListener("submit", handleSubmit);

function deleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex !== -1) {  
        tasks.splice(taskIndex, 1);
        localStorage.setItem(`tasks`, JSON.stringify(tasks));
        render();
        TaskCount(); 
    }
}

function render() {
    toDoForm.style.display = "block";
    toDoList.innerHTML = "";  
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const list = createList(i, task.id, task.work);
        toDoList.innerHTML += list;
    }
    bindElements();
}

function TaskCount() {
    const taskCountElement = document.querySelector("#task-count");
    if (taskCountElement) {
        taskCountElement.textContent = `${tasks.length} items left`;
    }
}

function handleEditClick(event) {
    event.preventDefault();
    const taskId = event.target.closest('[data-id]').dataset.id; 
    const task = tasks.find(task => task.id == taskId);
    toDoForm.style.display = "none";
    const editForm = createEditForm(task.id, task.work);
    toDoList.innerHTML = editForm;
    bindElements();
}

function bindElements() {
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", handleDeleteClick);
    });
    
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(editBtn => {
        editBtn.addEventListener("click", handleEditClick);
    });
    
    const returnBackBtn = document.querySelector("#return-back-btn");
    if (returnBackBtn) {
        returnBackBtn.addEventListener("click", render);
    }
    
    const editUserForm = document.querySelector("#edit-task-form");
    if (editUserForm) {
        editUserForm.addEventListener("submit", handleEditForm);
    }
}

function createList(index, id, work) {
    return `
        <div id="task-list" class="task-list">
            <p><img class="work-img" src="assets/img/work.png" alt="">${work}</p>
            <div class="rect" ></div>
            <a href="#" class="edit-btn" data-id="${id}"><img src="assets/img/edit.png" alt=""></a>
            <a href="#" class="delete-btn" data-id="${id}"><img src="assets/img/delete.png" alt=""></a>
        </div>
    `;
}

function createEditForm(id, work){
    return `
    <form id="edit-task-form">
            <input type="hidden" value="${id}" name="id">
            <label for=""></label>
            <input class="edit-input" type="text" name="work" value="${work}">
        </form>
    `
}

function handleEditForm(event){
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formObj = Object.fromEntries(formData);
    if(formObj.work == ""){
        alert("Boş alan bırakılamaz");
        return;
    }
    const task = tasks.find(task => task.id == formObj.id);
    task.work = formObj.work,
    localStorage.setItem(`tasks`, JSON.stringify(tasks));
    render();
}
