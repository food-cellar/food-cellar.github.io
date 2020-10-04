const fs = require('fs');

const categories = JSON.parse(fs.readFileSync('./ingredientCategories.json'));
const parsed = {};

for (let id in categories) {
    const current = categories[id];
    parsed[current.id] = current;
    delete current.id;
}

fs.writeFileSync('./ingredientCategories-new.json', JSON.stringify(parsed, null, 2));


/*
//const files = fs.readdirSync('./recipes');
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
for (let file of files) {
    const recipes = JSON.parse(fs.readFileSync('./recipes/' + file));

    for (let id in recipes) {
        const current = recipes[id];
        for (let ingredient of current.ingredients) {
            ingredient.id = ingredients[ingredient.id].id;
        }
    }

    fs.writeFileSync('./' + file, JSON.stringify(recipes, null, 2));
}
*/


/*
fs.writeFileSync('./ingredientCategories.json', JSON.stringify(categories, null, 2));
fs.writeFileSync('./ingredientIndex.json', JSON.stringify(parsed, null, 2));


*/