const fs = require('fs');
const App = require('./src/App');

if (process.argv.length < 4) {
  throw new Error('You have to pass source json file and destination json file');
}

const source = process.argv[2];
const destination = process.argv[3];

// Load json from source file
const originalJsonString = fs.readFileSync(source);

// Convert it to js object
const data = JSON.parse(originalJsonString);


const app = new App(data);

const res = app.invoke();

fs.writeFileSync(destination, JSON.stringify(res));
