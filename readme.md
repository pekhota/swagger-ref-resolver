# Swagger reference resolver

Script which parse swagger json, goes to each $ref and resolve it to its object.
Also it does merge for allof properties

## Usage

node index.js source.json target.json