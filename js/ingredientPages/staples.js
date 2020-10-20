import e from '../dom.js';
import ingredientList from '../common/ingredientList.js';
import { addStaple, removeStaple, isStaple, isBanned } from '../storage.js';


export default function staplesPage(router) {
    const ingredients = router.context.ingredients;
    
    const element = e('section', e('h2', 'Универсални съставки'));
    
    const colorId = '#bbbbff';
    const table = ingredientList('s-', ingredients, addStaple, removeStaple, isStaple, colorId);

    table.entries.forEach(e => {
        if (isStaple(e._record.id)) {
            e.style.backgroundColor = colorId;
        } else if (isBanned(e._record.id)) {
            e.style.backgroundColor = '#ffeeee';
        }
    });

    element.appendChild(table);

    router.render(element);
}