class Router {
    constructor(routes) {
        this.main = document.querySelector('main');
        this.routes = routes;
        this.Nav(this.routes);
    }
    Styler = new Style();


    Render = (route) => {
        this.main.innerHTML = '';
        if (route.path == '/' || route.path == ''){
            this.main.appendChild(this.routes['/'].template);
        } else if (!this.routes[route.path]) {
            this.notFound();
        } else {
            this.main.appendChild(this.routes[route.path].template);
        }

    }

    notFound () {
        this.main.innerHTML = `
        <h1>404</h1>
        <h2>Not Found</h2>
        `
    }

    Nav (routes) {
        const header = document.querySelector('header');
        const nav = document.createElement('nav');
        const ul = document.createElement('ul');
        Object.keys(routes).forEach((path) => {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.href = path;
            a.textContent = routes[path].title;
            let css = {
                'text-decoration': 'none',
                'color': 'black',
            }
            this.Styler.Stylize(css, a);
            li.appendChild(a);
            ul.appendChild(li);
            a.addEventListener('click', (e) => {
                e.preventDefault();
                history.pushState(null, null, path);
                this.Render({ path });
            });
        });
        nav.appendChild(ul);
        header.appendChild(nav);
        
    }
}

class Style {
    constructor() {
    }

    Stylize = (style, element) => {
        Object.keys(style).forEach((key) => {
            element.style[key] = style[key];
        });
    }
}

class State {
    constructor(state) {
        this.state = state;
    }

    getState = () => {
        return this.state;
    }
    setState = (state) => {
        this.state = state;
        this.onStateChange();
    }

    onStateInit = () => {
        // an empty function to be overwritten
    }

    setOnStateInit = (callback) => {
        this.onStateInit = callback;
    }

    onStateChange = () => {
        // an empty function to be overwritten
    }

    setOnStateChange = (callback) => {
        this.onStateChange = callback;
    }



}

class Fetch  {
    constructor() {
    }

    onProgress = () => {
        // an empty function to be overwritten
    }
    setOnProgress = (callback) => {
        this.onProgress = callback;
    }
    onFail = () => {
        // an empty function to be overwritten
    }
    setOnFail = (callback) => {
        this.onFail = callback;
    }
    onSuccess = () => {
        // an empty function to be overwritten
    }
    setOnSuccess = (callback) => {
        this.onSuccess = callback;
    }

    Get = (url) => {
        this.onProgress();
        fetch(url)
        .then(res => res.json())
        .then(data => this.onSuccess(data))
        .catch(error => this.onFail(error));
        
    }

    Post = (url, data) => {
        this.onProgress();
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                this.onSuccess();
            } else {
                this.onFail();
            }
        })
    }

}

export { Router, State, Style, Fetch };