import { CreateElement } from "./script";
function LocalStorage(nameColumn) {
    const array = [];
    for (const element of document.querySelector(`.container_${nameColumn}`).children) {
        if (element.classList.contains('todo')) {
            array.push(element.children[0].textContent)
        }
    }
    localStorage.setItem(`${nameColumn}`, JSON.stringify(array))
}

function LoadLocalStorage(nameColumn) {
     const savedData = localStorage.getItem(nameColumn);
    if (savedData) {
        const array = JSON.parse(savedData);
        const container = document.querySelector(`.container_${nameColumn}`);
        const addTodo = container.querySelector('.add_todo');
        
        array.forEach(text => {
            const tempElement = { children: [{ value: text }] };
            const todoCard = CreateElement(container, tempElement);
            addTodo.insertAdjacentElement('beforebegin', todoCard);
        });
    }
}

window.addEventListener('beforeunload', () => {
    LocalStorage('todo');
    LocalStorage('in_progress');
    LocalStorage('done');
})

LoadLocalStorage('todo');
LoadLocalStorage('in_progress');
LoadLocalStorage('done');