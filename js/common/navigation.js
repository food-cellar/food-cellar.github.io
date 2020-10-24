import e, { a, swap } from '../dom.js';


export function createMainNav(router) {
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
        router.link(a('/ingredients/banned', 'Изключени', { className: 'nav-tab label border-main' }), 'active'),
        router.link(a('/ingredients/mandatory', 'Задължителни', { className: 'nav-tab label border-main' }), 'active')
    ], { id: 'nav-sub' });
}

function createCategoryNav(router, select) {
    const newNav = e('nav', [], { id: 'nav-sub', className: 'drawer' });

    for (let name in router.context.recipeIndex) {
        const category = router.context.recipeIndex[name];
        const navLink = router.link(a(`/recipes/${category.name}`, category.label, { className: 'nav-tab label border-main' }), 'active');
        newNav.appendChild(navLink);
    }

    newNav._toggle = toggleDrawer;
    return newNav;

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