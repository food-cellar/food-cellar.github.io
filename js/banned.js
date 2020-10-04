import ingredientList from './ingredientList.js';
import { addBanned, removeBanned, isBanned, isStaple } from './storage.js';


export default function bannedPage(ingredients) {
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