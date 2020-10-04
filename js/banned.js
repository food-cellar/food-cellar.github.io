import e, { checkbox, swap } from './dom.js';
import filterTable from './filterTable.js';
import ingredientList from './ingredientList.js';
import { addBanned, removeBanned, isBanned, isStaple } from './storage.js';


export default function bannedPage(ingredients) {
    ingredients = ingredients.sort((a, b) => {
        if (isBanned(a.id) == isBanned(b.id)) {
            return b.used - a.used;
        } else {
            return isBanned(a.id) ? -1 : 1;
        }
    });

    const colorId = '#ffbbbb';
    const table = ingredientList('b-', ingredients, addBanned, removeBanned, isBanned, colorId);

    table.entries.forEach(e => {
        if (isBanned(e._record.id)) {
            e.style.backgroundColor = colorId;
        } else if (isStaple(e._record.id)) {
            e.style.backgroundColor = '#eeeeff';
        }
    });

    return table;
}