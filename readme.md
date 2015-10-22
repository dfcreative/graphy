Graphy is an easy-peasy graph visualiser.

[image]

[Demo](http://dfcreative.github.io/graphy).

## Usage

`$ npm install graphy`

```js
var Graphy = require('graphy');

var graphy = new Graphy({
	element: document.querySelector('.my-element')
});

//add node with params
graphy.add({
	thumbnail:
});

document.body.appendChild(graphy.element);
```