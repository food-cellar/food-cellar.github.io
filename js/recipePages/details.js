import { getRecipe } from '../data.js';
import e, { div } from '../dom.js';


export default async function detailPage(router) {
    const recipeId = router.params.id;
    const { recipe } = await getRecipe(recipeId);

    const element = div([
        e('h2', recipe.name),
        e('ul', recipe.recipeIngredient.map(i => e('li', i))),
        div(recipe.recipeInstructions.map(s => e('p', s.text)))
    ]);

    router.render(element);
}