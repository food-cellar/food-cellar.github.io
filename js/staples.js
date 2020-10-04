import ingredientList from './ingredientList.js';
import { addStaple, removeStaple, isStaple, isBanned } from './storage.js';


export default function staplesPage(ingredients) {
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