import e, { div } from '../dom.js';


export default function recipeDetails(recipe) {
    const element = div([
        e('h2', recipe.name),
        e('ul', recipe.recipeIngredient.map(i => e('li', i))),
        div(recipe.recipeInstructions.map(s => e('p', s.text)))
    ]);

    return element;
}