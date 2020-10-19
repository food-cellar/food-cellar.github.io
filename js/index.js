import { Router } from './routing.js';
import { a } from './dom.js';


window.addEventListener('load', () => {
    const router = new Router();
    router.get('home', (params) => {
        console.log('at home');
    });
    router.get('catalog', (params) => {
        console.log('at catalog');
    });
    router.handle();

    document.body.appendChild(router.link(a('/home', 'Go home'), 'active'));
    document.body.appendChild(router.link(a('/catalog', 'Catalog'), 'active'));
    document.body.appendChild(router.link(a('/catalog/1', 'Item 1'), 'active'));
    document.body.appendChild(router.link(a('/catalog/2', 'Item 2'), 'active'));
});