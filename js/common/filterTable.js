import e, { tr, td, input, div } from '../dom.js';


/**
 * 
 * @param {*[]} data 
 * @param {{name: string, label: string, parse?: function}[]} layout 
 */
export default function filterTable(data, layout) {
    const thead = e('thead', tr(layout.map(d => filterHead(d, onInput))));
    const entires = data.map(r => row(r, layout));
    const tbody = e('tbody', entires);

    const table = e('table', [thead, tbody]);
    table.thead = thead;
    table.tbody = tbody;
    table.entries = entires;

    const filter = {};
    for (let h of layout) {
        filter[h.name] = '';
    }

    return table;

    function onInput(name, value) {
        filter[name] = value;
        filterRows();
    }

    function filterRows() {
        for (let row of entires) {
            if (row._match(filter)) {
                table.appendChild(row);
            } else {
                row.remove();
            }
        }
    }
}

/**
 * @param {*} record
 * @param {{name: string, label: string, parse?: function}[]} layout 
 */
function row(record, layout) {
    const element = tr(layout.map(d => {
        const value = d.parse ? d.parse(record[d.name]) : record[d.name];
        return td(value);
    }));

    element._match = match;
    element._record = record;

    return element;

    function match(filter) {
        for (let name in filter) {
            if (record[name].toString().toLocaleLowerCase().includes(filter[name].toLocaleLowerCase()) === false) {
                return false;
            }
        }
        return true;
    }
}

/**
 * 
 * @param {{name: string, label: string, parse?: function}} descriptor 
 */
function filterHead(descriptor, handler) {
    if (descriptor.filter === false) {
        return e('th', descriptor.label);
    } else {
        const field = input({ type: 'text' });
        field.addEventListener('input', () => handler(descriptor.alias || descriptor.name, field.value));

        const element = e('th', [descriptor.label, div(field)]);

        return element;
    }
}