# babel-plugin-console-events

## Problem
Sometimes there is a situation when you need to execute certain code when calling the `console.log()`. 
For example, send a request to the server. One way to do this is to override the original method. 
But in this case, we lose the filename and the line number where the `console.log` call occurs. 
Something like this is needed:
```javascript
console.on('log', () =>{})
```

## What does this plugin do?
All it does is replace console method calls
```javascript
console.log(/*...args*/)
```
with
```javascript
console.log(/*...args*/);

if (console.events) {
    console.events.emit({
        type: "log",
        args: [/*...args*/],
        loc: ["code.ts", "2"],
    });
}
```
and provides a utility `subscribe` function to listen for these events

## Installation

With npm:
```sh
npm install babel-plugin-console-events
```

With yarn:
```sh
yarn add babel-plugin-console-events
```

## Setup

### .babelrc
```json
{
  "plugins": ["babel-plugin-console-events"]
}
```

### .craco.config.js
```javascript
module.exports = {
    babel: {
        plugins: [
            "babel-plugin-console-events",
        ],
        loaderOptions: { /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */ },
        loaderOptions: (babelLoaderOptions, { env, paths }) => {
            return babelLoaderOptions;
        }
    }
};
```

## APIs

### `subscribe()`

Pass the listener to the `subscribe` function and it will be called when calling the `log, warn, info, debug, error` methods of the console object.

```javascript
import { subscribe } from 'babel-plugin-console-events2'

subscribe((event) => {
//  code here
})
```

#### **Attention! Do not call console methods inside the listener, otherwise it will lead to recursion.**

## LICENSE

MIT