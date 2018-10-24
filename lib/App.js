const ExampleMaker = require('./ExampleMaker');

class App {
    constructor(data) {
        this.data = data;
    }

    invoke() {
        return this.traverse(this.data);
    }

    /**
     * Function to process array items in swagger specification
     * @param arr
     * @returns {Array}
     */
    processArray(arr) {
        return arr.map((row) => this.traverse(row));
    }

    /**
     * Function to replace $ref key by proper object from #/ notation. Ex: #/definitions/PetModel
     * @param item
     * @returns {*}
     */
    processRef(item) {
        return this.traverse(item['$ref'].replace('#/', '').split('/').reduce((acc, cur) => acc[cur], this.data));
    };

    // start * https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge ******
    // we need deep recursive merge for 'allof' swagger key
    /**
     * Simple object check.
     * @param item
     * @returns {boolean}
     */
    isObjectAndNotArray(item) {
        return (this.isObject(item) && !Array.isArray(item));
    };

    /**
     *
     * @param item
     * @returns {*|boolean}
     */
    isObject(item) {
        return (item && typeof item === 'object')
    };

    /**
     * Deep merge two objects.
     * @param target
     * @param sources
     */
    mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObjectAndNotArray(target) && this.isObjectAndNotArray(source)) {
            for (const key in source) {
                // noinspection JSUnfilteredForInLoop
                if (this.isObjectAndNotArray(source[key])) {
                    if (!target[key]) Object.assign(target, {[key]: {}});
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }

        return this.mergeDeep(target, ...sources);
    };

    // end *** https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge ******


    /**
     * Main recursive function to process swagger json
     * @param object
     * @returns {*}
     */
    traverse(object) {
        if (!this.isObject(object)) return object;

        if (Array.isArray(object)) return this.processArray(object);

        if (object['$ref']) return this.processRef(object);

        if (object['allOf']) return object['allOf'].reduce((acc, cur) => this.mergeDeep(acc, this.traverse(cur)), {});

        const data = Object.entries(object).reduce((acc, [key, item]) => {
            if (this.isObject(item)) {
                return Object.assign(acc, {[key]: Array.isArray(item) ? this.processArray(item) : this.traverse(item)});
            }

            return Object.assign(acc, {[key]: item});
        }, {});

        if (object['application/vnd.api+json']) {
            // "examples": {
            //     "response":
            const exampleMaker = new ExampleMaker(data);
            data['application/vnd.api+json']['examples'] = {
                'response': {
                    "value": exampleMaker.invoke()
                }
            };
        }

        return data;
    };
}

module.exports = App;