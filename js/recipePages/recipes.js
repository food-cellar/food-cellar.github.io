import { getRecommended } from '../data.js';
import e, { a, div, span, button, loading } from '../dom.js';
import { mandatory, banned, available, staple } from '../storage.js';


export default function recipesPage(router) {
    const categoryName = router.params.category;
    const category = router.context.recipeIndex[categoryName];

    const body = {
        categoryName: category.name,
        mandatory,
        banned,
        available,
        staple,
        page: 1
    };

    const loader = loading();
    const element = e('section', [e('h2', category.label), loader]);
    nextPage();

    router.render(element);

    async function nextPage() {
        const filtered = await getRecommended(body);
        loader.remove();

        filtered.map(r => element.appendChild(recipeCard(r, router)));
        if (filtered.length == 20) {
            const btnMore = button('Покажи още', async () => {
                btnMore.remove();
                element.appendChild(loader);
                body.page++;
                await nextPage();
                loader.remove();
            }, { className: 'showMore alt' });
            element.appendChild(btnMore);
        }
    }
}

function recipeCard(record, router) {
    const href = `/recipe/${record.id}`;

    const element = a(href, [
        div(record.recipe.name, { className: 'cardLabel label' }),
        div([
            e('ul', record.ingredients.map(ingredientItem), { className: 'ingredientList' }),
            span(record.missingLabel, { className: 'cardCount' })
        ], { className: 'cardContent' })
    ], { className: 'cardArticle' });

    return router.link(element);

    function ingredientItem(ingredient) {
        //Ingredient ID as abbreviation is for debugging lists
        //const element = e('li', e('abbr', `${ingredient.qty} ${ingredient.name}`, { title: ingredient.id }));
        const asString = [ingredient.qty, ingredient.name].filter(s => s != 'Parsing error').join(' ');
        const element = e('li', e('span', asString));
        if (record.missingList.includes(ingredient.id)) {
            element.classList.add('missing');
        }
        return element;
    }
}

