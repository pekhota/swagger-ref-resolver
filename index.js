if(process.argv.length < 4) {
    throw new Error("You have to pass source json file and destination json file")
}

const source = process.argv[2];
const destination = process.argv[3];

const fs = require('fs');

// Load json from source file
const originalJsonString = fs.readFileSync(source);

// Convert it to js object
let data = JSON.parse(originalJsonString);

let app = {};

/**
 * Function to process array items in swagger specification
 * @param object
 * @returns {Array}
 */
app.processArray = function (object) {
    let toRet = [];
    for (let i = 0; i < object.length; i++) {
        let item = object[i];

        toRet.push(app.traverse(item));
    }
    return toRet;
};

/**
 * Function to replace $ref key by proper object from #/ notation. Ex: #/definitions/PetModel
 * @param item
 * @returns {*}
 */
app.processRef = function (item) {
    let key2 = item['$ref'].replace('#/', '');
    let key2split = key2.split('/');
    let splitItems = key2split;
    let nestedItem = data;
    for (let i = 0; i < splitItems.length; i++) {
        nestedItem = nestedItem[splitItems[i]];
    }

    return app.traverse(nestedItem);
};

// start * https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge ******
// we need deep recursive merge for 'allof' swagger key
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
app.isObject = function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 */
app.mergeDeep = function (target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (app.isObject(target) && app.isObject(source)) {
        for (const key in source) {
            // noinspection JSUnfilteredForInLoop
            if (app.isObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}});
                app.mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return app.mergeDeep(target, ...sources);
};

// end *** https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge ******

/**
 * Main recursive function to process swagger json
 * @param object
 * @returns {*}
 */
app.traverse = function (object) {
    if (typeof object === 'object') {
        if (object.constructor === Array) {
            return app.processArray(object)
        } else {

            if (typeof object['$ref'] !== "undefined") {
                return app.processRef(object);
            } else {
                if (typeof object['allOf'] !== "undefined") {
                    let merged = {};
                    for (let i = 0; i < object['allOf'].length; i++) {
                        let item = object['allOf'][i];
                        let processedItem = app.traverse(item);
                        merged = app.mergeDeep(merged, processedItem);
                    }

                    return merged;
                } else {
                    let toRet = {};
                    for (let key in object) {
                        let item = object[key];

                        if (typeof item === 'object') {
                            if (item.constructor === Array) {
                                toRet[key] = app.processArray(item);
                            } else {
                                if (typeof item['$ref'] === "undefined") {
                                    toRet[key] = app.traverse(item);
                                } else {
                                    toRet[key] = app.traverse(item);
                                }
                            }
                        } else {
                            toRet[key] = item;
                        }

                    }
                    return toRet;
                }
            }
        }
    } else {
        return object;
    }
};

let res = app.traverse(data);

fs.writeFileSync(destination, JSON.stringify(res));