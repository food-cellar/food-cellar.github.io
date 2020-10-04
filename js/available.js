import ingredientList from './ingredientList.js';
import { addAvailable, removeAvailable, isAvailable, isStaple, isBanned } from './storage.js';


export default function availablePage(ingredients) {
    ingredients = ingredients
        .filter(i => (isStaple(i.id) || isBanned(i.id)) == false)
        .sort((a, b) => {
            if (isAvailable(a.id) == isAvailable(b.id)) {
                return b.used - a.used;
            } else {
                return isAvailable(a.id) ? -1 : 1;
            }
        });

    const colorId = '#99ff99';
    const table = ingredientList('a-', ingredients, addAvailable, removeAvailable, isAvailable, colorId);

    table.entries.forEach(e => {
        if (isAvailable(e._record.id)) {
            e.style.backgroundColor = colorId;
        }
    });

    return table;
}