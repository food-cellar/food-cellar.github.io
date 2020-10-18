import { getRecommended } from './data.js';
import e, { div, span, button } from './dom.js';
import { mandatory, banned, available, staple } from './storage.js';


export default async function recipesPage(category, showDetails) {
    const body = {
        categoryName: category.name,
        mandatory,
        banned,
        available,
        staple,
        page: 1
    };
    
    const element = e('section', e('h2', category.label));
    nextPage();
    return element;

    async function nextPage() {
        const filtered = await getRecommended(body);

        filtered.map(r => element.appendChild(recipeCard(r, showDetails)));
        if (filtered.length == 20) {
            const btnMore = button('Покажи още', () => {
                btnMore.remove();
                body.page++;
                nextPage();
            });
            element.appendChild(btnMore);
        }
    }
}

function recipeCard(record, showDetails) {
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
        //Ingredient ID as abbreviation is for debugging lists
        //const element = e('li', e('abbr', `${ingredient.qty} ${ingredient.name}`, { title: ingredient.id }));
        const element = e('li', e('span', `${ingredient.qty} ${ingredient.name}`));
        if (record.missingList.includes(ingredient.id)) {
            element.classList.add('missing');
        }
        return element;
    }
}

