class ExampleProcessors {
  static stringProcessor(val) {
    return val.example || 'some string';
  }

  static integerProcessor(val) {
    return val.example || 0;
  }

  static arrayProcessor(val) {
    return val.items && val.items.type && val.items.type === 'object' ? [ExampleProcessors.objectProcessor(
      val.items,
    )] : ['item here'];
  }

  static objectProcessor(val) {
    return val.properties
      ? Object.entries(val.properties)
        .reduce((acc, [key, val1]) => ExampleProcessors.someMethod(acc, key, val1),
          {}) : { 'no properties': true };
  }

  static get methodsMap() {
    return {
      string: ExampleProcessors.stringProcessor,
      integer: ExampleProcessors.integerProcessor,
      array: ExampleProcessors.arrayProcessor,
      object: ExampleProcessors.objectProcessor,
    };
  }

  static someMethod(acc, key, val) {
    return (!(val && val.type) || !Object.keys(ExampleProcessors.methodsMap).includes(val.type))
      ? Object.assign(acc, { [key]: 'unsupported value here' })
      : Object.assign(acc, { [key]: ExampleProcessors.methodsMap[val.type](val) });
  }
}

module.exports = ExampleProcessors;
