const host = 'http://localhost:5000/';


export async function getIndex() {
    const categories = await (await fetch(host + 'data/categories')).json();
    const recipeIndex = {};
    for (let category of categories) {
        (() => {
            let content = null;
            recipeIndex[category.name] = {
                name: category.name,
                label: category.label,
                getData: async () => {
                    if (content === null) {
                        content = await (await fetch(host + 'data/categories/' + category.name)).json();
                        for (let id in content) {
                            content[id] = {
                                id,
                                ingredientIds: content[id]
                            };
                        }
                    }
                    return content;
                }
            };
        })();
    }
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