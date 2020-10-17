import e from './dom.js';
import ingredientList from './ingredientList.js';
import { addMandatory, removeMandatory, isMandatory, isStaple, isBanned } from './storage.js';


export default function mandatoryPage(ingredients) {
    const element = e('section', e('h2', 'Задължителни съставки'));
    
    ingredients = ingredients.filter(i => (isStaple(i.id) || isBanned(i.id)) == false);

    const colorId = '#99ff99';
    const table = ingredientList('m-', ingredients, addMandatory, removeMandatory, isMandatory, colorId);

    table.entries.forEach(e => {
        if (isMandatory(e._record.id)) {
            e.style.backgroundColor = colorId;
        }
    });

    element.appendChild(table);

    return element;
}