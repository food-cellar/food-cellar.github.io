import e from './dom.js';
import { getIndex, getRecipe } from './data.js';
import staplesPage from './ingredientPages/staples.js';
import bannedPage from './ingredientPages/banned.js';
import availablePage from './ingredientPages/available.js';
import mandatoryPage from './ingredientPages/mandatory.js';
import recipesPage from './recipePages/recipes.js';
import detailsPage from './recipePages/details.js';


initialize();

async function initialize() {
    const main = document.querySelector('main');
    const navigation = document.querySelector('#categories');

    const { recipeIndex, ingredientsIndex } = await getIndex();
    const ingredients = Object.values(ingredientsIndex);

    const staplesSection = () => staplesPage(ingredients);
    const bannedSection = () => bannedPage(ingredients);
    const availableSection = () => availablePage(ingredients);
    const mandatorySection = () => mandatoryPage(ingredients);

    for (let name in recipeIndex) {
        const category = recipeIndex[name];
        const currentSection = async () => await recipesPage(category, showDetails);
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
            document.title = 'Food Cellar';
            window.history.pushState({}, document.title, '/');

            main.innerHTML = '';
            main.appendChild(await section());
        });
    }

    function showDetails(recipe, href, ev) {
        ev.preventDefault();
        document.title = recipe.name;
        window.history.pushState({}, document.title, href);

        main.innerHTML = '';
        main.appendChild(detailsPage(recipe));
    }
}
