import e from '../dom.js';
import ingredientList from '../common/ingredientList.js';
import { addAvailable, removeAvailable, isAvailable, isStaple, isBanned } from '../storage.js';


export default function availablePage(ingredients) {
    const element = e('section', e('h2', 'Налични съставки'));

    ingredients = ingredients.filter(i => (isStaple(i.id) || isBanned(i.id)) == false);

    const colorId = '#99ff99';
    const table = ingredientList('a-', ingredients, addAvailable, removeAvailable, isAvailable, colorId);

    table.entries.forEach(e => {
        if (isAvailable(e._record.id)) {
            e.style.backgroundColor = colorId;
        }
    });

    element.appendChild(table);

    return element;
}