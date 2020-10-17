import { getRecipe } from './data.js';
import e, { div, span } from './dom.js';
import { isStaple, isBanned, isAvailable, hasMandatory } from './storage.js';


export default async function recipesPage(category, ingredientsIndex, showDetails) {
    // TODO data should only be resolved when the page is activated
    const recipes = Object.values((await category.getData()));

    const filtered = recipes
        .filter(r => hasMandatory(r.ingredientIds))
        .filter(r => r.ingredientIds.reduce((p, c) => p || isBanned(c), false) == false)
        .map(r => {
            const recipe = JSON.parse(JSON.stringify(r)); //Easiest deep-copy
            recipe.missingList = [];
            let missing = 0;
            let popularity = 1;
            for (let id of recipe.ingredientIds) {
                if ((isAvailable(id) || isStaple(id)) == false) {
                    missing++;
                    recipe.missingList.push(id);
                }
                popularity = Math.sqrt(popularity * ingredientsIndex[id].popularity);
            }
            recipe.missing = missing;
            recipe.missingLabel = `${recipe.ingredientIds.length - missing} / ${recipe.ingredientIds.length}`;
            recipe.popularity = popularity;

            return recipe;
        }).sort((a, b) => (a.missing - b.missing) || (b.popularity - a.popularity));

    const element = e('section', e('h2', category.label));
    filtered.slice(0, 40).map(async r => element.appendChild(await recipeCard(r, showDetails)));

    return element;
}

async function recipeCard(record, showDetails) {
    record = Object.assign(record, await getRecipe(record.id));
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
        const element = e('li', e('abbr', `${ingredient.qty} ${ingredient.name}`, { title: ingredient.id }));
        if (record.missingList.includes(ingredient.id)) {
            element.classList.add('missing');
        }
        return element;
    }
}

