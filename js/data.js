const categories = [
    {
        name: 'apetizer',
        label: 'Предястия',
        src: 'data/index/apetizer.json'
    },
    {
        name: 'bread',
        label: 'Хляб',
        src: 'data/index/bread.json'
    },
    {
        name: 'cocktail',
        label: 'Коктейли',
        src: 'data/index/cocktail.json'
    },
    {
        name: 'dessert',
        label: 'Десерти',
        src: 'data/index/dessert.json'
    },
    {
        name: 'drink',
        label: 'Напитки',
        src: 'data/index/drink.json'
    },
    {
        name: 'main',
        label: 'Основно',
        src: 'data/index/main.json'
    },
    {
        name: 'other',
        label: 'Други',
        src: 'data/index/other.json'
    },
    {
        name: 'salad',
        label: 'Салати',
        src: 'data/index/salad.json'
    },
    {
        name: 'sandwich',
        label: 'Сандвичи',
        src: 'data/index/sandwich.json'
    },
    {
        name: 'sauce',
        label: 'Сосове',
        src: 'data/index/sauce.json'
    },
    {
        name: 'side',
        label: 'Гарнитури',
        src: 'data/index/side.json'
    },
    {
        name: 'soup',
        label: 'Супи',
        src: 'data/index/soup.json'
    },
    {
        name: 'soup-other',
        label: 'Супи - други',
        src: 'data/index/soup-other.json'
    },
];


export async function getData() {
    const recipeIndex = {};
    for (let category of categories) {
        (() => {
            let content = null;
            recipeIndex[category.name] = {
                name: category.name,
                label: category.label,
                getData: async () => {
                    if (content === null) {
                        content = await (await fetch(category.src)).json();
                        for (let id in content) {
                            content[id] = {
                                id,
                                ingredientIds: content[id]
                            };
                        }
                        
                        //** debug */
                        //content = Object.entries(content).reduce((p, [k, v]) => ({ k: v }), {});
                        //** end debug */
                    }
                    return content;
                }
            };
        })();
    }
    const ingredientsIndex = await (await fetch('data/ingredients.json')).json();
    const categoryIndex = await (await fetch('data/ingredientCategories.json')).json();

    for (let id in ingredientsIndex) {
        const current = ingredientsIndex[id];
        current.id = id;
        current.category = categoryIndex[current.categoryId].label;
        current.popularity = current.used / 5000;
    }

    return { recipeIndex, ingredientsIndex };
}

export async function getRecipe(id) {
    const recipe = await (await fetch(`data/db/${id}.json`)).json();
    return recipe;
}