import {Router, Style , State} from './functions.js';

const Home = () => {
    const content = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = 'Todo List App';
    content.appendChild(h1);
    let ol = document.createElement('ol');
    let todos = [];
    if (localStorage.getItem('list')) {
        todos = JSON.parse(localStorage.getItem('list'));
    } 
    const list = new State(todos);
    const state = list.getState();
    const generateList = () => {
        ol.innerHTML = '';
        state.forEach((item) => {
            let li = document.createElement('li');
            let text = document.createElement('span');
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            text.textContent = item;
            li.appendChild(text);
            li.appendChild(deleteButton);
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                let index = state.indexOf(item);
                state.splice(index, 1);
                ol.innerHTML = '';
                list.setState(state);
            });
            ol.appendChild(li);
        });
    }

    list.setOnStateChange(() => {
        localStorage.setItem('list', JSON.stringify(state));
        generateList();
    });
    generateList();
    content.appendChild(ol);
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add a todo';
    const button = document.createElement('button');
    button.textContent = 'Add';
    form.appendChild(input);
    form.appendChild(button);
    content.appendChild(form);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        state.push(input.value);
        ol.innerHTML = '';
        list.setState(state);
        input.value = '';
    });
    content.appendChild(ol);
    content.appendChild(form);
    return content;
}

const routes = {
    '/': {
        title: 'Home',
        template: Home()
    }
}

const router = new Router(routes);
router.Render({ path: window.location.pathname });