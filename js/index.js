import { Router } from './routing.js';
import e, { div, a, swap, loading } from './dom.js';
import './common/scrollBubble.js';

import { getIndex, getRecipe, settings } from './data.js';
import staplesPage from './ingredientPages/staples.js';
import availablePage from './ingredientPages/available.js';
import bannedPage from './ingredientPages/banned.js';
import recipesPage from './recipePages/recipes.js';
import detailsPage from './recipePages/details.js';



window.addEventListener('load', mainPage);

async function mainPage() {
    renderPage(loading);

    /* BEGIN Environment detection */
    try {
        const envRequest = await fetch('/LOCAL');
        if (envRequest.status != 404) {
            settings.host = await envRequest.text();
        } else {
            // Environemnt is production
        }
    } catch (err) {
        // Environemnt is production
    }
    /* END Environment detection */
    
    const context = await getIndex();
    context.ingredients = Object.values(context.ingredientsIndex);

    const router = new Router(context);

    createMainNav(router);
    renderPage(() => a('/ingredients/available', 'Избери налични съставки', { id: 'getStarted', className: 'label' }));

    router.get('/recipe/{id}', detailsRoute);
    router.get('/ingredients', ingredientsPage);
    router.get('/recipes', categoriesPage);
    router.handle(true);
}

function createMainNav(router) {
    const menu = document.querySelector('#nav-main');

    menu.appendChild(router.link(a('/ingredients', 'Съставки', { className: 'nav-tab main label border-main' }), 'active'));
    menu.appendChild(router.link(a('/recipes', 'Рецепти', { className: 'nav-tab main label border-main' }), 'active'));
}


function ingredientsPage(router) {
    const menu = document.querySelector('#nav-sub');

    const newNav = e('nav', [
        router.link(a('/ingredients/available', 'Налични', { className: 'nav-tab label border-main' }), 'active'),
        router.link(a('/ingredients/banned', 'Изключени', { className: 'nav-tab label border-main' }), 'active')
    ], { id: 'nav-sub' });

    const ingredients = router.context.ingredients;
    router.get('/ingredients/staples', () => renderPage(() => staplesPage(ingredients)));
    router.get('/ingredients/available', () => renderPage(() => availablePage(ingredients)));
    router.get('/ingredients/banned', () => renderPage(() => bannedPage(ingredients)));

    swap(menu, newNav);
}

function categoriesPage(router) {
    const menu = document.querySelector('#nav-sub');

    const select = a('javascript:void(0)', 'Категория', { className: 'select label border-main' });
    select.addEventListener('click', ev => {
        ev.preventDefault();
        toggleDrawer();
    });

    const drawer = div([], { className: 'drawer' });
    const newNav = e('nav', [select, drawer], { id: 'nav-sub' });

    for (let name in router.context.recipeIndex) {
        const category = router.context.recipeIndex[name];
        const navLink = router.link(a(`/recipes/${category.name}`, category.label, { className: 'nav-tab label border-main' }), 'active');
        drawer.appendChild(navLink);
    }
    router.get('/recipes/{category}', prerender);

    swap(menu, newNav);

    async function prerender(router) {
        const category = router.context.recipeIndex[router.params.category];
        const page = () => recipesPage(category, showDetails);
        renderPage(page);
    }

    function toggleDrawer() {
        if (select.classList.contains('selected')) {
            close();
        } else {
            open();
        }

        function open() {
            select.classList.add('selected');
            drawer.style.display = 'inline-block';

            setTimeout(() => document.addEventListener('click', clickHandler), 0);
        }

        function close() {
            select.classList.remove('selected');
            drawer.style.display = 'none';

            document.removeEventListener('click', clickHandler);
        }

        function clickHandler(ev) {
            close();
        }
    }
}

async function detailsRoute(router) {
    const recipeId = router.params.id;
    const recipe = await getRecipe(recipeId);
    showDetails(recipe.recipe, `/recipe/${recipeId}`, { preventDefault: () => { } });
}

function showDetails(recipe, href, ev) {
    ev.preventDefault();

    const main = document.querySelector('main');

    document.title = recipe.name;
    window.history.pushState({}, document.title, href);

    main.innerHTML = '';
    main.appendChild(detailsPage(recipe));
}

async function renderPage(page) {
    const main = document.querySelector('main');
    main.innerHTML = '';
    main.appendChild(await page());
}