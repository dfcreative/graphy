/**
 * Graphy — graph component
 *
 * @module graphy
 */


var extend = require('xtend/mutable');
var inherits = require('inherits');
var Emitter = require('events').EventEmitter;
var Connector = require('connection-line');
var setCaret = require('caret-position2/set');
var autosize = require('autosize');
var Draggable = require('draggy');
var randomItem = require('random-item');


/**
 * Create graph controller
 *
 * @constructor
 */
function Graphy (options) {
	if (!(this instanceof Graphy)) return new Graphy(options);

	extend(this, options);

	//ensure element
	if (!this.element) {
		this.element = document.createElement('div');
	}

	this.element.classList.add('graphy');
}

inherits(Graphy, Emitter);


/**
 * Default thumbnails for nodes.
 */
Graphy.prototype.thumbnails = '❆☀☁❤☯☮✇✹✺✻✼✽✾❀✿❁❃❇❈❉❊❋'.split('');


/**
 * Default names for nodes.
 */
Graphy.prototype.titles = 'Magic Light Energy Flow Silence Consciousness Universe Warm Fun Joy Power'.split(' ');


/**
 * Create new node within the graph.
 *
 * @param {Object} node Node params
 *
 * @return {HTMLElement} Freshly created node element
 */
Graphy.prototype.createNode = function (options) {
	var self = this;

	//get node options
	options = extend({
		title: randomItem(this.titles),
		thumbnail: randomItem(this.thumbnails),
		description: 'Just try and you will see',
		numberOfInputs: 1,
		numberOfOutputs: 1,
		state: 'init'
	}, options);

	//create basic node
	var nodeEl = document.createElement('div');
	nodeEl.className = 'graphy-node';
	nodeEl.setAttribute('title', options.title);

	//create thumbnail
	if (options.thumbnail) {
		var thumbnail = document.createElement('div');
		thumbnail.className = 'graphy-node-thumbnail';
		thumbnail.setAttribute('data-graphy-node-thumbnail', '');
		thumbnail.setAttribute('data-graphy-node-handle', '');
		thumbnail.innerHTML = options.thumbnail;
		nodeEl.appendChild(thumbnail);
	}

	//append title, if passed
	if (options.title) {
		var titleEl = document.createElement('textarea');
		titleEl.className = 'graphy-node-title';
		titleEl.setAttribute('data-graphy-node-title', '');
		titleEl.rows = 1;
		titleEl.value = options.title;
		nodeEl.appendChild(titleEl);

		//select all by focus
		titleEl.addEventListener('click', function () {
			//don’t select unless it is not selected before
			if (document.activeElement !== titleEl) {
				setCaret(titleEl, 0, 9999);
			}
		});

		titleEl.addEventListener('keydown', function (e) {
			//close self by pressing enter
			if (e.ctrlKey && e.which === 13) {
				self.element.focus();
				e.stopPropagation();
			}
		});

		//make title adjust size
		autosize(titleEl);
	}

	//create input
	if (options.numberOfInputs) {
		var inputEl = document.createElement('div');
		inputEl.className = 'graphy-node-input';

		nodeEl.appendChild(inputEl);
	}

	//create output
	if (options.numberOfOutputs) {
		var outputEl = document.createElement('div');
		outputEl.className = 'graphy-node-output';

		nodeEl.appendChild(outputEl);
	}


	//make self draggable, load initial position btw
	var draggable = new Draggable(nodeEl, {
		cancel: ['textarea', '.CodeMirror']
	});


	//focus on click
	nodeEl.addEventListener('mousedown', function () {
		nodeEl.focus();
	});

	//handle keypresses
	nodeEl.addEventListener('keydown', function (e) {
		//ignore events from the inner elements
		if (document.activeElement !== nodeEl) {
			return;
		}

		//unfocus by escape
		if (e.which === 27) {
			nodeEl.blur();
		}
	});


	//insert element
	self.element.appendChild(nodeEl);

	//save node properties on node element
	nodeEl.node = extend(options, {
		title: titleEl,
		input: inputEl,
		output: outputEl
	});


	return nodeEl;
};


/**
 * Delete existing node
 *
 * @param {HTMLElement} node Remove existing node, delete connections as well
 *
 * @return {HTMLElement} Removed node
 */
Graphy.prototype.removeNode = function (node) {
	this.element.removeChild(node);
};


/**
 * Create connection.
 * If target node is undefined, then connection is considered a hanging one.
 *
 * @param {Node} from Source node
 * @param {Node} to Target node
 *
 * @return {AudioConnection} Audio connection element
 */
Graphy.prototype.createConnection = function (from, to, how) {
	var connector = new Connector(extend({
		from: from.node.output,
		to: to.node.input,
		curvature: 0.2
	}, how));

	//add class
	connector.element.classList.add('graphy-connection');


	//update connection when node moves
	from.addEventListener('drag', function () {
		connector.update();
	});
	to.addEventListener('drag', function () {
		connector.update();
	});

	this.element.appendChild(connector.element);

	connector.update();
};


module.exports = Graphy;