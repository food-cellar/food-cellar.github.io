import e, { checkbox } from './dom.js';
import filterTable from './filterTable.js';
import { addAvailable, removeAvailable, isAvailable, isStaple, isBanned } from './data.js';


export default function availablePage(ingredients) {
    ingredients = ingredients
        .filter(i => (isStaple(i.id) || isBanned(i.id)) == false)
        .sort((a, b) => {
            if (isAvailable(a.id) == isAvailable(b.id)) {
                return b.popularity - a.popularity;
            } else {
                return isAvailable(a.id) ? -1 : 1;
            }
        });
    ingredients.forEach(i => {
        const selected = checkbox((ev) => {
            const value = ev.target.checked;
            if (value) {
                ev.target.parentNode.parentNode.style.backgroundColor = '#99ff99';
                addAvailable(i.id);
            } else {
                ev.target.parentNode.parentNode.style.backgroundColor = '';
                removeAvailable(i.id);
            }
        }, { id: 'a-' + i.id });
        if (isAvailable(i.id)) {
            selected.checked = true;
        }

        i.actions = selected;
        i.label = e('label', i.displayName, { htmlFor: 'a-' + i.id });
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

    table.entries.forEach(e => {
        if (isAvailable(e._record.id)) {
            e.style.backgroundColor = '#99ff99';
        }
    });

    return table;
}