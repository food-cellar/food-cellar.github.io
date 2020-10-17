import e from './dom.js';
import { getData, getRecipe } from './data.js';
import staplesPage from './staples.js';
import bannedPage from './banned.js';
import availablePage from './available.js';
import mandatoryPage from './mandatory.js';
import recipesPage from './recipes.js';
import detailsPage from './details.js';


initialize();

async function initialize() {
    const main = document.querySelector('main');
    const navigation = document.querySelector('#categories');

    const { recipeIndex, ingredientsIndex } = await getData();
    const ingredients = Object.values(ingredientsIndex);

    const staplesSection = () => staplesPage(ingredients);
    const bannedSection = () => bannedPage(ingredients);
    const availableSection = () => availablePage(ingredients);
    const mandatorySection = () => mandatoryPage(ingredients);

    for (let name in recipeIndex) {
        const category = recipeIndex[name];
        const currentSection = async () => await recipesPage(category, ingredientsIndex, showDetails);
        const btn = e('button', category.label);
        navigation.appendChild(btn);

        setupSection(btn, currentSection);
    }

    setupSection('#btnStaples', staplesSection);
    setupSection('#btnBanned', bannedSection);
    setupSection('#btnAvailable', availableSection);
    setupSection('#btnMandatory', mandatorySection);

    const query = window.location.search.split('?')[1];
    if (query !== undefined && query.includes('id=')) {
        const tokens = query.split('&').map(t => t.split('=')).reduce((p, c) => Object.assign({}, p, { [c[0]]: c[1] }), {});
        const recipeId = tokens.id;
        const recipe = await getRecipe(recipeId);
        showDetails(recipe.recipe, `?id=${recipeId}`, { preventDefault: () => { } });
    } else {
        document.querySelector('#btnAvailable').click();
    }

    function setupSection(btnSelector, section) {
        const btn = btnSelector instanceof Node ? btnSelector : document.querySelector(btnSelector);
        btn.addEventListener('click', async () => {
            const title = document.title;
            window.history.pushState({}, title, '/');

            main.innerHTML = '';
            main.appendChild(await section());
        });
    }

    function showDetails(recipe, href, ev) {
        ev.preventDefault();
        const title = document.title;
        window.history.pushState({}, title, href);

        main.innerHTML = '';
        main.appendChild(detailsPage(recipe));
    }
}
