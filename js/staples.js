import e, { checkbox, swap } from './dom.js';
import filterTable from './filterTable.js';
import ingredientList from './ingredientList.js';
import { addStaple, removeStaple, isStaple, isBanned } from './storage.js';


export default function staplesPage(ingredients) {
    ingredients = ingredients.sort((a, b) => {
        if (isStaple(a.id) == isStaple(b.id)) {
            return b.used - a.used;
        } else {
            return isStaple(a.id) ? -1 : 1;
        }
    });

    const colorId = '#bbbbff';
    const table = ingredientList('s-', ingredients, addStaple, removeStaple, isStaple, colorId);

    table.entries.forEach(e => {
        if (isStaple(e._record.id)) {
            e.style.backgroundColor = colorId;
        } else if (isBanned(e._record.id)) {
            e.style.backgroundColor = '#ffeeee';
        }
    });

    return table;
}