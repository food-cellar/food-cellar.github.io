import { getRecommended } from './data.js';
import e, { div, span } from './dom.js';
import { mandatory, banned, available, staple } from './storage.js';


export default async function recipesPage(category, ingredientsIndex, showDetails) {
    const body = {
        categoryName: category.name,
        mandatory,
        banned,
        available,
        staple,
    };
    const filtered = await getRecommended(body);

    const element = e('section', e('h2', category.label));
    filtered.slice(0, 40).map(async r => element.appendChild(await recipeCard(r, showDetails)));

    return element;
}

async function recipeCard(record, showDetails) {
    const href = `?id=${record.id}`;

    const element = e('a', [
        div(record.recipe.name, { className: 'cardLabel' }),
        div([
            e('ul', record.ingredients.map(ingredientItem), { className: 'ingredientList' }),
            span(record.missingLabel, { className: 'cardCount' })
        ], { className: 'cardContent' })
    ], { href, className: 'cardArticle' });

    element.addEventListener('click', (ev) => showDetails(record.recipe, href, ev));

    return element;

    function ingredientItem(ingredient) {
        //Ingredient ID as abbreviation is for debugging lists
        //const element = e('li', e('abbr', `${ingredient.qty} ${ingredient.name}`, { title: ingredient.id }));
        const element = e('li', e('span', `${ingredient.qty} ${ingredient.name}`));
        if (record.missingList.includes(ingredient.id)) {
            element.classList.add('missing');
        }
        return element;
    }
}

