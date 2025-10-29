import { checkValidate, deleteTodoCard} from "./function";
let actualElement;
let move = false; 
let offsetX = 0;   
let offsetY = 0;  
let margin = 0;
const addCard = [...document.querySelectorAll('.add_todo_open')]
const closeAddCard = [...document.querySelectorAll('.add_todo_close')]
const btnAddTodo = [...document.querySelectorAll('.btn_add_todo')]
let elementUnder;
const predictionPosition = document.createElement('div');
predictionPosition.classList.add('todo_prediction')

let targetElement = null;

closeAddCard.forEach((e) => {
    e.addEventListener('click', (element) => { 
        const addActive = element.target.parentElement
        addActive.previousElementSibling.classList.remove('none')
        addActive.classList.add('none')
    })
})
console.log(addCard)
addCard.forEach((e) => {
    e.addEventListener('click', (element) => {
        element.target.classList.add('none')
        const addActive = element.target.nextElementSibling
        addActive.classList.remove('none')
        addActive.children[0].focus()
        addActive.children[0].value = ''
    })
})
btnAddTodo.forEach((e) => {
    e.addEventListener('click', (element) => {
        const addActive = element.target.parentElement
        const container = addActive.closest('.container')
        const addTodo = container.querySelector('.add_todo')
        if (checkValidate(addActive.children[0])) {
            const todoCard = CreateElement(container, addActive)
            addTodo.insertAdjacentElement('beforebegin', todoCard);
            addActive.previousElementSibling.classList.remove('none')
            addActive.classList.add('none')
        }
        addActive.children[0].value = ''
    })
})

document.addEventListener('mousemove', function(e) {
    if (!actualElement || !move) return;
    actualElement.style.left = e.clientX - offsetX + 'px';
    actualElement.style.top = e.clientY - offsetY + 'px';

    actualElement.style.visibility = 'hidden'
    elementUnder = document.elementFromPoint(e.clientX, e.clientY);
    const container = elementUnder ? elementUnder.closest('.container') : undefined;

    actualElement.style.visibility = '';

    if (container && (elementUnder !== document.querySelector('html'))) {
        let predictionPlaced = false;
        for (const element of container.children) {
            if (element.classList.contains('todo') && !element.classList.contains('grabling')) {
                const actualTop = parseInt(actualElement.style.top) || 0;
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop > actualTop) {
                    predictionPosition.style.width = actualElement.style.width;
                    predictionPosition.style.height = actualElement.style.height; 
                    element.insertAdjacentElement('beforebegin', predictionPosition);
                    predictionPlaced = true;
                    targetElement = element
                    break; 
                }
            }
        }
        if (!predictionPlaced) {
            const addTodo = container.querySelector('.add_todo');
            if (addTodo) {
                predictionPosition.style.width = actualElement.style.width;
                predictionPosition.style.height = actualElement.style.height;
                addTodo.insertAdjacentElement('beforebegin', predictionPosition);
                targetElement = null;
            }
        }
    }
});

document.addEventListener('mouseup', function(e) {
    move = false;
    if (actualElement) {
        predictionPosition.remove();
        actualElement.classList.remove('grabling')
        actualElement.style.visibility = 'hidden'
        elementUnder = document.elementFromPoint(e.clientX, e.clientY);
        const container = elementUnder ? elementUnder.closest('.container') : undefined;
        actualElement.style.visibility = ''
        actualElement.style.cursor = "grab";
        actualElement.style.margin = margin
        if (elementUnder == document.querySelector('html')) {
            actualElement.style.position = 'static'
            actualElement = undefined
        } else if (container) {
            if (targetElement == null) {
                const addTodo = container.querySelector('.add_todo');
                addTodo.insertAdjacentElement('beforebegin', actualElement)
                actualElement.style.position = 'static'
                actualElement = undefined
            } else {
                targetElement.insertAdjacentElement('beforebegin', actualElement)
                actualElement.style.position = 'static'
                actualElement = undefined
            } 
        } else {
            actualElement.style.margin = margin
            actualElement.style.position = 'static'
            actualElement = undefined
        }
    }
});

export function CreateElement(container, addActive) {
    const todoCard = document.createElement('div')
    todoCard.classList.add('todo')
    todoCard.attributes.data = container.attributes.data.value

    const deleteTodo = document.createElement('span')
    deleteTodo.textContent = '×'
    deleteTodo.classList.add('todo_delete');
    deleteTodo.classList.add('none');
    deleteTodo.addEventListener('click', deleteTodoCard);
    
    const textTodo = document.createElement('p')
    textTodo.classList.add('text_todo')
    textTodo.textContent = typeof addActive === 'string' ? addActive : addActive.children[0].value

    todoCard.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('todo_delete')) return;

        todoCard.style.cursor = "grabbing";
        actualElement = e.target.classList.contains('text_todo') ? e.target.parentElement : e.target
        actualElement.classList.add('grabling')
        move = true;
        const rect = actualElement.getBoundingClientRect();
        margin = actualElement.style.margin;
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        

        actualElement.style.position = 'fixed';
        actualElement.style.margin = '0';
        actualElement.style.width = rect.width + 'px';
        actualElement.style.height = rect.height + 'px';
        actualElement.style.zIndex = '1000';
        
        actualElement.style.left = e.clientX - offsetX + 'px';
        actualElement.style.top = e.clientY - offsetY + 'px';
    });

    todoCard.addEventListener('mouseenter', () => {
        deleteTodo.classList.remove('none')
    });

    todoCard.addEventListener('mouseleave', () => {
        deleteTodo.classList.add('none')
    })

    todoCard.append(textTodo);
    todoCard.append(deleteTodo);

    return todoCard
}