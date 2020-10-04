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
    main.style.display = 'none';
    const navigation = document.querySelector('#categories');

    const { recipeIndex, ingredientsIndex } = await getData();
    const ingredients = Object.values(ingredientsIndex);

    const staplesSection = staplesPage(ingredients);
    const bannedSection = bannedPage(ingredients);
    const availableSection = availablePage(ingredients);
    const mandatorySection = mandatoryPage(ingredients);
    const detailsSection = e('section');
    main.appendChild(detailsSection);

    const sections = [staplesSection, bannedSection, availableSection, mandatorySection, detailsSection];
    for (let name in recipeIndex) {
        const category = recipeIndex[name];
        const currentSection = await recipesPage(category, ingredientsIndex, showDetails);
        sections.push(currentSection);
        const btn = e('button', category.label);
        navigation.appendChild(btn);

        setupSection(btn, currentSection, sections);
    }
    sections.forEach(s => s.style.display = 'none');
    availableSection.style.display = '';

    setupSection('#btnStaples', staplesSection, sections);
    setupSection('#btnBanned', bannedSection, sections);
    setupSection('#btnAvailable', availableSection, sections);
    setupSection('#btnMandatory', mandatorySection, sections);

    main.style.display = '';


    function setupSection(btnSelector, section, sections) {
        const btn = btnSelector instanceof Node ? btnSelector : document.querySelector(btnSelector);
        btn.addEventListener('click', () => {
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
