/**
 * Graph node controller
 * Provides number of inputs, outputs.
 * Provides title.
 *
 * @module connection-graph/node
 */

var extend = require('xtend/mutable');
var randomItem = require('random-item');


/**
 * Node controller
 *
 * @constructor
 */
function Node (options) {
	if (!(this instanceof Node)) return new Node(options);

	extend(this, options);

	//ensure element
	if (!this.element) {
		this.element = document.createElement('graph-node');
	}

	//ensure thumbnail
	if (!this.thumbnail) {
		this.thumbnail = randomItem(this.thumbnails);
	}

	//ensure title
	if (!this.title) {
		this.title = randomItem(this.titles);
	}
};


/**
 * Numbers of available connections
 */
Node.prototype.numberOfInputs = 1;
Node.prototype.numberOfOutputs = 1;


/**
 * Node title to display below
 */
Node.prototype.title;


/**
 * Node thumbnail
 */
Node.prototype.thumbnail;