import e from '../dom.js';
import ingredientList from '../common/ingredientList.js';
import { addBanned, removeBanned, isBanned, isStaple } from '../storage.js';


export default function bannedPage(router) {
    const ingredients = router.context.ingredients;

    const element = e('section', e('h2', 'Изключени съставки'));

    const colorId = '#ffbbbb';
    const table = ingredientList('b-', ingredients, addBanned, removeBanned, isBanned, colorId);

    table.entries.forEach(e => {
        if (isBanned(e._record.id)) {
            e.style.backgroundColor = colorId;
        } else if (isStaple(e._record.id)) {
            e.style.backgroundColor = '#eeeeff';
        }
    });

    element.appendChild(table);

    router.render(element);
}