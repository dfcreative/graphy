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
var offset = require('mucss/offset');


/**
 * Create graph controller
 *
 * @constructor
 */
function Graphy (options) {
	if (!(this instanceof Graphy)) return new Graphy(options);

	var self = this;

	extend(self, options);

	//ensure element
	if (!self.element) {
		self.element = document.createElement('div');
	}

	self.element.classList.add('graphy');

	//manage cursors
	self.element.addEventListener('dragstart', function () {
		self.element.style.cursor = 'move';
	});
	self.element.addEventListener('dragend', function () {
		self.element.style.cursor = null;
	});

	self.update();
}

inherits(Graphy, Emitter);


/**
 * Default thumbnails for nodes.
 */
Graphy.prototype.thumbnails = '☒☀☯✹✺✻✼✽✾❀✿❁❃❇❈❉❊❋'.split('');


/**
 * Default names for nodes.
 */
Graphy.prototype.titles = ['Magic', 'Portal', 'Random', 'Something', 'Something else', 'Unknown', 'Object', 'Another object', 'Other', 'This', 'That', 'Thing'];


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
	nodeEl.setAttribute('tabindex', 1);

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
		// titleEl.rows = 1;
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
		outputEl.setAttribute('data-graphy-node-output', '');

		//create connection on click on output
		outputEl.addEventListener('mousedown', function (e) {
			//place connector to the place of click - relative to the graphy container
			var gOffset = offset(self.element);

			var connector = new Connector({
				from: nodeEl,
				to: [
					e.pageX - gOffset.left,
					e.pageY - gOffset.top
				]
			});
			connector.element.classList.add('graphy-connection');
			connector.element.classList.add('graphy-connection-hangling');

			//change main cursor
			self.element.style.cursor = 'crosshair';

			self.element.appendChild(connector.element);

			document.addEventListener('mousemove', updateConnector);

			function updateConnector (e) {
				connector.to = [
					e.pageX - gOffset.left,
					e.pageY - gOffset.top
				];
				connector.update();
			}

			document.addEventListener('mouseup', off);

			function off () {
				self.element.style.cursor = null;
				self.element.removeChild(connector.element);
				document.removeEventListener('mousemove', updateConnector);
				document.removeEventListener('mouseup', off);
			}
		});

		nodeEl.appendChild(outputEl);
	}


	//make self draggable, load initial position btw
	var draggable = new Draggable(nodeEl, {
		threshold: 10,
		cancel: ['textarea', '.CodeMirror', '[data-graphy-node-output]', '[data-graphy-node-input]']
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
		from: from,
		to: to,
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


Graphy.prototype.update = function () {

};


module.exports = Graphy;