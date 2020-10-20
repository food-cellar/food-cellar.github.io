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

    const nav = createMainNav(router);
    renderPage(() => router.link(a('/ingredients/available', 'Избери налични съставки', { id: 'getStarted', className: 'label' })));

    router.get('/recipe/{id}', detailsRoute);

    router.get('/ingredients', nav.showIngredientsNav);
    router.get('/ingredients/staples', () => renderPage(() => staplesPage(context.ingredients)));
    router.get('/ingredients/available', () => renderPage(() => availablePage(context.ingredients)));
    router.get('/ingredients/banned', () => renderPage(() => bannedPage(context.ingredients)));

    router.get('/recipes', nav.showRecipesNav);
    router.handle(true);
}

function createMainNav(router) {
    const main = document.querySelector('#nav-main');
    let sub = document.querySelector('#nav-sub');

    const select = a('javascript:void(0)', 'Рецепти', { className: 'nav-tab main label border-main select' });
    
    main.appendChild(router.link(a('/ingredients', 'Съставки', { className: 'nav-tab main label border-main' }), 'active'));
    main.appendChild(router.link(a('/recipes', 'Рецепти', { className: 'nav-tab main label border-main screen' }), 'active'));
    main.appendChild(select);

    const ingrNav = createIngrNav(router);
    const catNav = createCategoryNav(router, select);

    select.addEventListener('click', ev => {
        ev.preventDefault();
        showRecipesNav();
        catNav._toggle();
    });

    return {
        showIngredientsNav,
        showRecipesNav
    };

    function showIngredientsNav() {
        swap(sub, ingrNav);
        sub = ingrNav;
    }

    function showRecipesNav() {
        swap(sub, catNav);
        sub = catNav;
    }
}

function createIngrNav(router) {
    return e('nav', [
        router.link(a('/ingredients/available', 'Налични', { className: 'nav-tab label border-main' }), 'active'),
        router.link(a('/ingredients/banned', 'Изключени', { className: 'nav-tab label border-main' }), 'active')
    ], { id: 'nav-sub' });
}

function createCategoryNav(router, select) {
    const newNav = e('nav', [], { id: 'nav-sub', className: 'drawer' });

    for (let name in router.context.recipeIndex) {
        const category = router.context.recipeIndex[name];
        const navLink = router.link(a(`/recipes/${category.name}`, category.label, { className: 'nav-tab label border-main' }), 'active');
        newNav.appendChild(navLink);
    }
    router.get('/recipes/{category}', prerender);

    newNav._toggle = toggleDrawer;
    return newNav;

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
            newNav.style.display = 'inline-block';

            setTimeout(() => document.addEventListener('click', clickHandler), 0);
        }

        function close() {
            select.classList.remove('selected');
            newNav.style.display = 'none';

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