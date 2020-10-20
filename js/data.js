export const settings = {
    host: 'https://food-cellar.herokuapp.com/'
};

export async function getIndex() {
    const recipeIndex = await (await fetch(settings.host + 'data/categories')).json();
    const ingredientsIndex = await (await fetch(settings.host + 'data/ingredients')).json();

    return { recipeIndex, ingredientsIndex };
}

export async function getRecipe(id) {
    const recipe = await (await fetch(settings.host + `data/recipes/${id}`)).json();
    return recipe;
}

export async function getRecommended(body) {
    return await (await fetch(settings.host + 'data/browse', {
        method: 'POST',
        body: JSON.stringify(body)
    })).json();
}