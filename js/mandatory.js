import e, { checkbox } from './dom.js';
import filterTable from './filterTable.js';
import { addMandatory, removeMandatory, isMandatory, isStaple, isBanned } from './storage.js';


export default function mandatoryPage(ingredients) {
    ingredients = ingredients
        .filter(i => (isStaple(i.id) || isBanned(i.id)) == false)
        .sort((a, b) => {
            if (isMandatory(a.id) == isMandatory(b.id)) {
                return b.popularity - a.popularity;
            } else {
                return isMandatory(a.id) ? -1 : 1;
            }
        });
    ingredients.forEach(i => {
        const selected = checkbox((ev) => {
            const value = ev.target.checked;
            if (value) {
                ev.target.parentNode.parentNode.style.backgroundColor = '#99ff99';
                addMandatory(i.id);
            } else {
                ev.target.parentNode.parentNode.style.backgroundColor = '';
                removeMandatory(i.id);
            }
        }, { id: 'm-' + i.id });
        if (isMandatory(i.id)) {
            selected.checked = true;
        }

        i.actions = selected;
        i.label = e('label', i.displayName, { htmlFor: 'm-' + i.id });
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
        if (isMandatory(e._record.id)) {
            e.style.backgroundColor = '#99ff99';
        }
    });

    return table;
}