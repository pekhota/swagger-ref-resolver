const ExampleProcessors = require('./ExampleProcessors');
const { get } = require('./utils');

class ExampleMaker {
  constructor(data) {
    this.data = data;
  }

  invoke() {
    return ExampleMaker.traverse(this.data);
  }

  static traverse(item) {
    return get(item, 'application/vnd.api+json.schema.type') === 'object'
      ? ExampleProcessors.objectProcessor(get(item, 'application/vnd.api+json.schema')) : {};
  }
}

module.exports = ExampleMaker;
