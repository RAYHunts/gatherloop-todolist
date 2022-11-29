import {Router, Style , State, Fetch} from './functions.js';

const Home = () => {
    const content = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = 'Todo List App';
    content.appendChild(h1);
    let ol = document.createElement('ol');
    let todos = [];
    if (localStorage.getItem('list') && localStorage.getItem('list') != 'undefined') {
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
        generateList();
        localStorage.setItem('list', JSON.stringify(state));
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

const Products = () => {
    const content = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = 'Products';
    content.appendChild(h1);
    const url = 'https://dummyjson.com/products/search?q=';
    const Fetcher = new Fetch();
    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search for a product';
    let button = document.createElement('button');
    button.textContent = 'Search';
    content.appendChild(input);
    content.appendChild(button);
    button.addEventListener('click', (e) => {
        e.preventDefault();
        Fetcher.Get(url + input.value);
    });
    const dataContainer = document.createElement('div');
    content.append(dataContainer);
    Fetcher.setOnProgress(() => {
        console.log('Loading...');
        dataContainer.innerHTML = 'Loading...';
    });
    Fetcher.setOnSuccess(({products}) => {
        const div = document.createElement('div');
        if (products.length > 0) {
            products.forEach((product) => {
                let title = document.createElement('h1');
                title.textContent = product.title;
                let description = document.createElement('p');
                description.textContent = product.description;
                let price = document.createElement('p');
                price.textContent = product.price;
                let images = document.createElement('div');
                product.images.forEach((image) => {
                    let img = document.createElement('img');
                    img.src = image;
                    images.appendChild(img);
                });
                div.appendChild(title);
                div.appendChild(description);
                div.appendChild(price);
                div.appendChild(images);
            });
        } else {
            div.textContent = 'No products found';
        }
        dataContainer.innerHTML = '';
        dataContainer.appendChild(div);
    });
    Fetcher.setOnFail((error) => {
        console.log(error);
        alert(error);
    });
    
        
    return content;
}
const routes = {
    '/': {
        title: 'Home',
        template: Home()
    },
    '/products': {
        title: 'Products',
        template: Products()
    },
}

const router = new Router(routes);
router.Render({ path: window.location.pathname });