const ExampleProcessors = require('./ExampleProcessors');

class ExampleMaker {
    constructor(data) {
        this.data = data;
    }

    invoke() {
        return this.traverse(this.data);
    }

    traverse(data) {
        return data['application/vnd.api+json'] && data['application/vnd.api+json']['schema'] && data['application/vnd.api+json']['schema']['type'] === 'object' ?
            ExampleProcessors.objectProcessor(data['application/vnd.api+json']['schema']) : {};
    }
}


module.exports = ExampleMaker;