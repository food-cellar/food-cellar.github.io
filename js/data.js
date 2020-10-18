const host = 'http://localhost:5000/';


export async function getIndex() {
    const recipeIndex = await (await fetch(host + 'data/categories')).json();
    const ingredientsIndex = await (await fetch(host + 'data/ingredients')).json();

    return { recipeIndex, ingredientsIndex };
}

export async function getRecipe(id) {
    const recipe = await (await fetch(host + `data/recipes/${id}`)).json();
    return recipe;
}

export async function getRecommended(body) {
    return await (await fetch(host + 'data/browse', {
        method: 'POST',
        body: JSON.stringify(body)
    })).json();
}