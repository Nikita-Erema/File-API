let actualElement;
let move = false; 
let offsetX = 0;   
let offsetY = 0;  
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
        addActive.children[0].value = ''
    })
})
btnAddTodo.forEach((e) => {
    e.addEventListener('click', (element) => {
        const addActive = element.target.parentElement
        const container = addActive.closest('.container')
        const addTodo = container.querySelector('.add_todo')
        if (addActive.children[0].value) {
            const todoCard = CreateElement(container, addActive)
            container.insertBefore(todoCard, addTodo);
        }
        addActive.children[0].value = ''
    })
})

function deleteTodoCard(e) {
    e.target.parentElement.remove()
}


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
                    container.insertBefore(predictionPosition, element);
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
                container.insertBefore(predictionPosition, addTodo);
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
        actualElement.style.cursor = "default";
        if (elementUnder == document.querySelector('html')) {
            actualElement.style.position = 'static'
            actualElement = undefined
        } else if (container) {
            if (targetElement == null) {
                const addTodo = container.querySelector('.add_todo');
                container.insertBefore(actualElement, addTodo)
                actualElement.style.position = 'static'
                actualElement = undefined
            } else {
                container.insertBefore(actualElement, targetElement)
                actualElement.style.position = 'static'
                actualElement = undefined
            }
        }
    }
});

function CreateElement(container, addActive) {
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

        console.log('mousedown', e)
        todoCard.style.cursor = "grabbing";
        actualElement = e.target.classList.contains('text_todo') ? e.target.parentElement : e.target
        actualElement.classList.add('grabling')
        move = true;
        const rect = actualElement.getBoundingClientRect();

        actualElement.style.position = 'absolute'

        actualElement.style.width = rect.width + 'px';
        actualElement.style.height = rect.height + 'px';

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        actualElement.style.left = rect.left + 'px';
        actualElement.style.top = rect.top + 'px'

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
            container.insertBefore(todoCard, addTodo);
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