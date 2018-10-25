# Swagger reference resolver

## Problem

For Openapi3:
1. Readme.io can't understand $ref method in some cases
2. Readme.io can't undestrand allof method in all cases
3. Readme.io can show examples for responses if passed. But its difficult to support.  

## Solution 

The script which proccess json and make manual operations optimising $ref allof 
and creating example sections. 

If you use yaml, convert it to json first.

## Usage

`node index.js source.json target.json`

## Technical debt

lib/ExampleMaker.js was hardcoded to support application/vnd.api+json responses only. 
You need manually change you code if you want another response types. 