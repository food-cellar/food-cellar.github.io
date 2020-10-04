const categories = [
    {
        name: 'apetizer',
        label: 'Предястия',
        src: 'data/recipes/apetizer.json'
    },
    {
        name: 'bread',
        label: 'Хляб',
        src: 'data/recipes/bread.json'
    },
    {
        name: 'cocktail',
        label: 'Коктейли',
        src: 'data/recipes/cocktail.json'
    },
    {
        name: 'dessert',
        label: 'Десерти',
        src: 'data/recipes/dessert.json'
    },
    {
        name: 'drink',
        label: 'Напитки',
        src: 'data/recipes/drink.json'
    },
    {
        name: 'main',
        label: 'Основно',
        src: 'data/recipes/main.json'
    },
    {
        name: 'other',
        label: 'Други',
        src: 'data/recipes/other.json'
    },
    {
        name: 'salad',
        label: 'Салати',
        src: 'data/recipes/salad.json'
    },
    {
        name: 'sandwich',
        label: 'Сандвичи',
        src: 'data/recipes/sandwich.json'
    },
    {
        name: 'sauce',
        label: 'Сосове',
        src: 'data/recipes/sauce.json'
    },
    {
        name: 'side',
        label: 'Гарнитури',
        src: 'data/recipes/side.json'
    },
    {
        name: 'soup',
        label: 'Супи',
        src: 'data/recipes/soup.json'
    },
    {
        name: 'soup-other',
        label: 'Супи - други',
        src: 'data/recipes/soup-other.json'
    },
];


export async function getData() {
    const recipeIndex = {};
    for (let category of categories) {
        (() => {
            let content = null;
            recipeIndex[category.name] = {
                label: category.label,
                getData: async () => {
                    if (content === null) {
                        content = await (await fetch(category.src)).json();
                    }
                    return content;
                }
            };
        })();
    }
    const ingredientsIndex = await (await fetch('data/ingredients.json')).json();
    const categoryIndex = await (await fetch('data/ingredientCategories.json')).json();

    return { recipeIndex, ingredientsIndex, categoryIndex };
}