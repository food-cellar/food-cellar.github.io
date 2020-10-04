const fs = require('fs');

/*
const categories = JSON.parse(fs.readFileSync('./ingredientCategories.json'));
const parsed = {};

for (let id in categories) {
    const current = categories[id];
    parsed[current.id] = current;
    delete current.id;
}

fs.writeFileSync('./ingredientCategories-new.json', JSON.stringify(parsed, null, 2));
*/

const files = fs.readdirSync('./recipes');

for (let file of files) {
    const index = {};
    const recipes = JSON.parse(fs.readFileSync('./recipes/' + file));

    for (let id in recipes) {
        const current = recipes[id];
        index[id] = current.ingredients.map(i => i.id);
        fs.writeFileSync('./db/' + id +'.json', JSON.stringify(current, null, 2));
    }

    fs.writeFileSync('./index/' + file, JSON.stringify(index, null, 2));
}

/*
const ingredients = JSON.parse(fs.readFileSync('./ingredients.json'));

const parsed = {};

for (let id in ingredients) {
    const current = ingredients[id];
    parsed[current.id] = current;
    delete current.id;
}

fs.writeFileSync('./ingredientIndex.json', JSON.stringify(parsed, null, 2));
*/

/*
fs.writeFileSync('./ingredientCategories.json', JSON.stringify(categories, null, 2));
fs.writeFileSync('./ingredientIndex.json', JSON.stringify(parsed, null, 2));


*/