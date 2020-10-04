import e, { div, span } from './dom.js';
import { isStaple, isBanned, isAvailable, hasMandatory } from './data.js';


export default function recipesPage(recipes, ingredientsIndex, showDetails) {
    const filtered = recipes
        .filter(r => hasMandatory(r.ingredients))
        .filter(r => r.ingredients.reduce((p, c) => p || isBanned(c.id), false) == false)
        .map(r => {
            const recipe = JSON.parse(JSON.stringify(r)); //Easiest deep-copy
            recipe.recipe.missingList = [];
            let missing = 0;
            let popularity = 1;
            for (let i of recipe.ingredients) {
                if ((isAvailable(i.id) || isStaple(i.id)) == false) {
                    missing++;
                    recipe.recipe.missingList.push(i.id);
                }
                popularity = Math.sqrt(popularity * ingredientsIndex[i.id].popularity);
            }
            recipe.recipe.missing = missing;
            recipe.recipe.missingLabel = `${recipe.ingredients.length - missing} / ${recipe.ingredients.length}`;
            recipe.recipe.popularity = popularity;

            return recipe;
        }).sort((a, b) => (a.recipe.missing - b.recipe.missing) || (b.recipe.popularity - a.recipe.popularity));

    const element = e('section', filtered.map(r => recipeCard(r, showDetails)));

    return element;
}

function recipeCard(record, showDetails) {
    const element = e('article', [
        div(record.recipe.name, { className: 'cardLabel' }),
        div([
            e('ul', record.ingredients.map(ingredientItem), { className: 'ingredientList' }),
            span(record.recipe.missingLabel, { className: 'cardCount' })
        ], { className: 'cardContent' })
    ]);

    element.addEventListener('click', () => showDetails(record.recipe));

    return element;

    function ingredientItem(ingredient) {
        const element = e('li', e('abbr', `${ingredient.qty} ${ingredient.name}`, { title: ingredient.id }));
        if (record.recipe.missingList.includes(ingredient.id)) {
            element.classList.add('missing');
        }
        return element;
    }
}

