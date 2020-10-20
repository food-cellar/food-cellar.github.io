import { Router } from './routing.js';
import { a, loading } from './dom.js';
import './common/scrollBubble.js';

import { getIndex, settings } from './data.js';
import { createMainNav } from './common/navigation.js';
import staplesPage from './ingredientPages/staples.js';
import availablePage from './ingredientPages/available.js';
import bannedPage from './ingredientPages/banned.js';
import recipesPage from './recipePages/recipes.js';
import detailsPage from './recipePages/details.js';


window.addEventListener('load', mainPage);

async function mainPage() {
    const main = document.querySelector('main');
    renderPage(loading());

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
    router.render = renderPage;

    const nav = createMainNav(router);
    renderPage(router.link(a('/ingredients/available', 'Избери налични съставки', { id: 'getStarted', className: 'alt' })));

    router.get('/recipe/{id}', detailsPage);

    router.get('/ingredients', nav.showIngredientsNav);
    router.get('/ingredients/staples', staplesPage);
    router.get('/ingredients/available', availablePage);
    router.get('/ingredients/banned', bannedPage);

    router.get('/recipes', nav.showRecipesNav);
    router.get('/recipes/{category}', recipesPage);

    router.handle(true);

    async function renderPage(page) {
        main.innerHTML = '';
        main.appendChild(page);
    }
}
