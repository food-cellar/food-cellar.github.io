import e, { checkbox, swap } from './dom.js';
import filterTable from './filterTable.js';
import { addStaple, removeStaple, isStaple, isBanned } from './storage.js';


export default function staplesPage(ingredients) {
    ingredients = ingredients.sort((a, b) => {
        if (isStaple(a.id) == isStaple(b.id)) {
            return b.popularity - a.popularity;
        } else {
            return isStaple(a.id) ? -1 : 1;
        }
    });
    ingredients.forEach(i => {
        const selected = checkbox((ev) => {
            const value = ev.target.checked;
            if (value) {
                ev.target.parentNode.parentNode.style.backgroundColor = '#bbbbff';
                addStaple(i.id);
            } else {
                ev.target.parentNode.parentNode.style.backgroundColor = '';
                removeStaple(i.id);
            }
        }, { id: 's-' + i.id });
        if (isStaple(i.id)) {
            selected.checked = true;
        }

        i.actions = selected;
        i.label = e('label', i.displayName, { htmlFor: 's-' + i.id });
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
        if (isStaple(e._record.id)) {
            e.style.backgroundColor = '#bbbbff';
        } else if (isBanned(e._record.id)) {
            e.style.backgroundColor = '#ffeeee';
        }
    });

    return table;
}