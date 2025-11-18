const btnClose = document.querySelector('.modal-task');
const task = document.querySelector('.task');
const menu = document.querySelector('.menu')
const menuCollapsed = document.querySelector('.menu-collapsed');

function closeMenu() { 
    menu.style.display = 'none';
    menuCollapsed.style.display = 'flex';
}

function openMenu() {
    menu.style.display = 'flex';
    menuCollapsed.style.display = 'none';
}

function closeModal() {
    btnClose.style.display = 'none';
    task.style.display = 'flex';
}

function openModal() {
    btnClose.style.display = 'flex';
    task.style.display = 'none' 
}

