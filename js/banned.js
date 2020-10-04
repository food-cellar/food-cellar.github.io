import e, { checkbox, swap } from './dom.js';
import filterTable from './filterTable.js';
import { addBanned, removeBanned, isBanned, isStaple } from './storage.js';


export default function bannedPage(ingredients) {
    ingredients = ingredients.sort((a, b) => {
        if (isBanned(a.id) == isBanned(b.id)) {
            return b.used - a.used;
        } else {
            return isBanned(a.id) ? -1 : 1;
        }
    });
    ingredients.forEach(i => {
        const selected = checkbox((ev) => {
            const value = ev.target.checked;
            if (value) {
                ev.target.parentNode.parentNode.style.backgroundColor = '#ffbbbb';
                addBanned(i.id);
            } else {
                ev.target.parentNode.parentNode.style.backgroundColor = '';
                removeBanned(i.id);
            }
        }, { id: 'b-' + i.id });
        if (isBanned(i.id)) {
            selected.checked = true;
        }

        i.actions = selected;
        i.label = e('label', i.displayName, { htmlFor: 'b-' + i.id });
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
        if (isBanned(e._record.id)) {
            e.style.backgroundColor = '#ffbbbb';
        } else if (isStaple(e._record.id)) {
            e.style.backgroundColor = '#eeeeff';
        }
    });

    return table;
}