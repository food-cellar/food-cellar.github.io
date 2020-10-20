import e, { checkbox } from '../dom.js';
import filterTable from './filterTable.js';


export default function ingredientList(name, ingredients, add, remove, is, colorId) {
    ingredients = ingredients.slice().sort((a, b) => {
        if (is(a.id) == is(b.id)) {
            return b.used - a.used;
        } else {
            return is(a.id) ? -1 : 1;
        }
    }).map(i => {
        const current = Object.assign({}, i);
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

        current.actions = selected;
        current.label = e('label', i.displayName, { htmlFor: name + i.id });

        return current;
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