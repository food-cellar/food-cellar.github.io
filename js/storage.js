localStorage.setItem('staples', JSON.stringify([2, 4, 9, 11, 12, 20, 23, 25, 28, 29, 36, 42, 60, 61, 65, 70, 75, 77, 66, 10, 1]));

function setupStorage(name) {
    let source = localStorage.getItem(name);
    if (source === null) {
        localStorage.setItem(name, JSON.stringify([]));
        source = [];
    } else {
        source = JSON.parse(source);
    }
    if (source.length > 0 && source[0].toString().includes('http')) {
        localStorage.setItem(name, JSON.stringify([]));
        source = [];
    }
    const data = source;

    function add(id) {
        data.push(Number(id));
        localStorage.setItem(name, JSON.stringify(data));
    }

    function remove(id) {
        for (let i = 0; i < data.length; i++) {
            if (data[i] == Number(id)) {
                data.splice(i, 1);
                localStorage.setItem(name, JSON.stringify(data));
                return;
            }
        }
    }

    function is(id) {
        return data.includes(Number(id));
    }

    function clear() {
        data.length = 0;
        localStorage.setItem(name, JSON.stringify(data));
    }

    return {
        _data: data,
        add,
        remove,
        is,
        clear
    };
}

const { add: addStaple, remove: removeStaple, is: isStaple, _data: staple } = setupStorage('staples');
const { add: addBanned, remove: removeBanned, is: isBanned, _data: banned } = setupStorage('banned');
const { add: addAvailable, remove: removeAvailable, is: isAvailable, _data: available } = setupStorage('available');
const { add: addMandatory, remove: removeMandatory, is: isMandatory, clear: clearMandatory, _data: mandatory } = setupStorage('mandatory');

export { addStaple, removeStaple, isStaple, staple };
export { addBanned, removeBanned, isBanned, banned };
export { addAvailable, removeAvailable, isAvailable, available };
export { addMandatory, removeMandatory, isMandatory, clearMandatory, mandatory };

export function hasMandatory(ingredientIds) {
    if (mandatory.length == 0) {
        return true;
    } else {
        return mandatory.reduce((p, c) => p && ingredientIds.map(i => Number(i)).includes(Number(c)), true);
    }
}
