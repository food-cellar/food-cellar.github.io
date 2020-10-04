import e, { checkbox } from './dom.js';
import filterTable from './filterTable.js';


export default function ingredientList(name, ingredients, add, remove, is, colorId) {
    ingredients.forEach(i => {
        const selected = checkbox((ev) => {
            const value = ev.target.checked;
            if (value) {
                ev.target.parentNode.parentNode.style.backgroundColor = colorId;
                add(i.id);
            } else {
                ev.target.parentNode.parentNode.style.backgroundColor = '';
                remove(i.id);
            }
        }, { id: name + i.id });
        if (is(i.id)) {
            selected.checked = true;
        }

        i.actions = selected;
        i.label = e('label', i.displayName, { htmlFor: name + i.id });
    });

    const table = filterTable(ingredients, [
        {
            name: 'actions',
            label: '',
            filter: false
        },
        {
            name: 'label',
            label: 'Съставка',
            alias: 'displayName'
        },
        {
            name: 'category',
            label: 'Категория'
        }
    ]);

    return table;
}