class ExampleProcessors {
    static get supportedTypes() {
        return ['string', 'integer', 'array', 'object'];
    }

    static stringProcessor(val) {
        return val['example'] ? val['example'] : 'some string';
    }

    static integerProcessor(val) {
        return val['example'] ? val['example'] : 0;
    }

    static arrayProcessor(val) {
        return val['items'] && val['items']['type'] && val['items']['type'] === 'object' ? [ExampleProcessors.objectProcessor(val['items'])] : ['item here'];
    }

    static objectProcessor(val) {
        return val['properties'] ?
            Object.entries(val['properties']).reduce((acc, [key, val]) => {
                return this.someMethod(acc, key, val);
            }, {}) : {'no properties': true};
    }

    static someMethod(acc, key, val) {
        return (!(val && val['type']) || ExampleProcessors.supportedTypes.indexOf(val['type']) === -1) ?
            Object.assign(acc, {[key]: 'unsupported value here'}) :
            Object.assign(acc, {[key]: ExampleProcessors[val['type'] + 'Processor'](val)});
    }
}

module.exports = ExampleProcessors;