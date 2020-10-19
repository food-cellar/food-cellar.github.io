import { getIndex, getRecipe } from './data.js';
import availablePage from './ingredientPages/available.js';
import bannedPage from './ingredientPages/banned.js';
import recipesPage from './recipePages/recipes.js';
import detailsPage from './recipePages/details.js';

import { Router } from './routing.js';
import e, { div, a, swap } from './dom.js';


window.addEventListener('load', mainPage);

async function mainPage() {
    const context = await getIndex();
    context.ingredients = Object.values(context.ingredientsIndex);

    const router = new Router(context);

    createMainNav(router);

    router.get('/recipe/{id}', detailsRoute);
    router.get('/ingredients', ingredientsPage);
    router.get('/recipes', categoriesPage);
    router.handle(true);
}

function createMainNav(router) {
    const menu = document.querySelector('#nav-main');

    menu.appendChild(router.link(a('/ingredients', 'Съставки', { className: 'nav-tab main' }), 'active'));
    menu.appendChild(router.link(a('/recipes', 'Рецепти', { className: 'nav-tab main' }), 'active'));
}


function ingredientsPage(router) {
    const menu = document.querySelector('#nav-sub');

    const newNav = e('nav', [
        router.link(a('/ingredients/available', 'Налични', { className: 'nav-tab' }), 'active'),
        router.link(a('/ingredients/banned', 'Изключени', { className: 'nav-tab' }), 'active')
    ], { id: 'nav-sub' });

    const ingredients = router.context.ingredients;
    router.get('/ingredients/available', () => renderPage(() => availablePage(ingredients)));
    router.get('/ingredients/banned', () => renderPage(() => bannedPage(ingredients)));

    swap(menu, newNav);
}

function categoriesPage(router) {
    const menu = document.querySelector('#nav-sub');

    const drawer = div([], { className: 'drawer' });
    const newNav = e('nav', drawer, { id: 'nav-sub' });

    for (let name in router.context.recipeIndex) {
        const category = router.context.recipeIndex[name];
        const navLink = router.link(a(`/recipes/${category.name}`, category.label, { className: 'nav-tab' }), 'active');
        drawer.appendChild(navLink);
    }
    router.get('/recipes/{category}', prerender);

    swap(menu, newNav);

    async function prerender(router) {
        const category = router.context.recipeIndex[router.params.category];
        const page = () => recipesPage(category, showDetails);
        renderPage(page);
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