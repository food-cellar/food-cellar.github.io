let staples = localStorage.getItem('staples');
if (staples === null) {
    localStorage.setItem('staples', JSON.stringify([]));
    staples = [];
} else {
    staples = JSON.parse(staples);
}

export function addStaple(id) {
    staples.push(id);
    localStorage.setItem('staples', JSON.stringify(staples));
}

export function removeStaple(id) {
    staples = staples.filter(i => i != id);
    localStorage.setItem('staples', JSON.stringify(staples));
}

export function isStaple(id) {
    return staples.includes(id);
}

let banned = localStorage.getItem('banned');
if (banned === null) {
    localStorage.setItem('banned', JSON.stringify([]));
    banned = [];
} else {
    banned = JSON.parse(banned);
}

export function addBanned(id) {
    banned.push(id);
    localStorage.setItem('banned', JSON.stringify(banned));
}

export function removeBanned(id) {
    banned = banned.filter(i => i != id);
    localStorage.setItem('banned', JSON.stringify(banned));
}

export function isBanned(id) {
    return banned.includes(id);
}

let available = localStorage.getItem('available');
if (available === null) {
    localStorage.setItem('available', JSON.stringify([]));
    available = [];
} else {
    available = JSON.parse(available);
}

export function addAvailable(id) {
    available.push(id);
    localStorage.setItem('available', JSON.stringify(available));
}

export function removeAvailable(id) {
    available = available.filter(i => i != id);
    localStorage.setItem('available', JSON.stringify(available));
}

export function isAvailable(id) {
    return available.includes(id);
}


let mandatory = localStorage.getItem('mandatory');
if (mandatory === null) {
    localStorage.setItem('mandatory', JSON.stringify([]));
    mandatory = [];
} else {
    mandatory = JSON.parse(mandatory);
}

export function addMandatory(id) {
    mandatory.push(id);
    localStorage.setItem('mandatory', JSON.stringify(mandatory));
}

export function removeMandatory(id) {
    mandatory = mandatory.filter(i => i != id);
    localStorage.setItem('mandatory', JSON.stringify(mandatory));
}

export function isMandatory(id) {
    return mandatory.includes(id);
}

export function hasMandatory(ingredients) {
    if (mandatory.length == 0) {
        return true;
    } else {
        return mandatory.reduce((p, c) => p && ingredients.map(i => i.id).includes(c), true);
    }
}