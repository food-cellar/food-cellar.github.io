function setupStorage(name) {
    let data = localStorage.getItem(name);
    if (data === null) {
        localStorage.setItem(name, JSON.stringify([]));
        data = [];
    } else {
        data = JSON.parse(data);
    }

    function add(id) {
        data.push(id);
        localStorage.setItem(name, JSON.stringify(data));
    }

    function remove(id) {
        data = data.filter(i => i != id);
        localStorage.setItem(name, JSON.stringify(data));
    }

    function is(id) {
        return data.includes(id);
    }

    return {
        _data: data,
        add,
        remove,
        is
    };
}

const { add: addStaple, remove: removeStaple, is: isStaple } = setupStorage('staples');
const { add: addBanned, remove: removeBanned, is: isBanned } = setupStorage('banned');
const { add: addAvailable, remove: removeAvailable, is: isAvailable } = setupStorage('available');
const { add: addMandatory, remove: removeMandatory, is: isMandatory, _data: mandatory } = setupStorage('mandatory');

export { addStaple, removeStaple, isStaple };
export { addBanned, removeBanned, isBanned };
export { addAvailable, removeAvailable, isAvailable };
export { addMandatory, removeMandatory, isMandatory };

export function hasMandatory(ingredients) {
    if (mandatory.length == 0) {
        return true;
    } else {
        return mandatory.reduce((p, c) => p && ingredients.map(i => i.id).includes(c), true);
    }
}
