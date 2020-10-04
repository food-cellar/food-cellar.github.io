import staplesPage from './staples.js';
import bannedPage from './banned.js';
import availablePage from './available.js';
import mandatoryPage from './mandatory.js';
import recipesPage from './recipes.js';
import detailsPage from './details.js';
import e from './dom.js';

initialize();


async function initialize() {
    const main = document.querySelector('main');

    const { mainIndex, soupIndex, ingredientsIndex } = await getData();
    const recipesSoup = Object.values(soupIndex);
    const recipesMain = Object.values(mainIndex);
    const ingredients = Object.values(ingredientsIndex);

    const staplesSection = staplesPage(ingredients);
    const bannedSection = bannedPage(ingredients);
    const availableSection = availablePage(ingredients);
    const mandatorySection = mandatoryPage(ingredients);
    const soupsSection = recipesPage(recipesSoup, ingredientsIndex, showDetails);
    const mainsSeciton = recipesPage(recipesMain, ingredientsIndex, showDetails);
    const detailsSection = e('section');
    const sections = [staplesSection, bannedSection, availableSection, mandatorySection, soupsSection, mainsSeciton, detailsSection];
    sections.forEach(s => s.style.display = 'none');
    availableSection.style.display = '';

    setupSection('#btnStaples', staplesSection, sections);
    setupSection('#btnBanned', bannedSection, sections);
    setupSection('#btnAvailable', availableSection, sections);
    setupSection('#btnMandatory', mandatorySection, sections);
    setupSection('#btnSoups', soupsSection, sections);
    setupSection('#btnMains', mainsSeciton, sections);
    main.appendChild(detailsSection);

    function setupSection(btnSelector, section, sections) {
        document.querySelector(btnSelector).addEventListener('click', () => {
            sections.forEach(s => s.style.display = 'none');
            section.style.display = '';
        });
        main.appendChild(section);
    }

    function showDetails(recipe) {
        sections.forEach(s => s.style.display = 'none');

        detailsSection.innerHTML = '';
        detailsSection.appendChild(detailsPage(recipe));

        detailsSection.style.display = '';
    }
}

async function getData() {
    const mainIndex = await (await fetch('data/recipes-main.json')).json();
    const soupIndex = await (await fetch('data/recipes-soup.json')).json();
    const ingredientsIndex = await (await fetch('data/ingredients.json')).json();

    return { mainIndex, soupIndex, ingredientsIndex };
}