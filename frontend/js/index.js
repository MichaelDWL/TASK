const btnClose = document.querySelector('.modal-task');
const task = document.querySelector('.task');



function closeModal() {
    btnClose.style.display = 'none';
    task.style.display = 'flex';
}

function openModal() {
    btnClose.style.display = 'flex';
    task.style.display = 'none' 
}

