import e from './dom.js';
import { getData } from './data.js';
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

    document.querySelector('#btnAvailable').click();

    function setupSection(btnSelector, section) {
        const btn = btnSelector instanceof Node ? btnSelector : document.querySelector(btnSelector);
        btn.addEventListener('click', async () => {
            main.innerHTML = '';
            main.appendChild(await section());
        });
    }

    function showDetails(recipe) {
        main.innerHTML = '';
        main.appendChild(detailsPage(recipe));
    }
}
