## What graphy is not

* A custom element. Because it is difficult to pick a two-words tag name for graphy. Besides, there might be a plenty of possible implementations, like, stream-graph, audio-graph, processing-graph, block-scheme, mind-map etc., end each one can use graphy as a basis, but register it’s own custom element.
* A Graph model. Graphy is not bound to any domain-specific data or logic, in that, nodes and connections can mean anything. Also it means that API is rather DOM-like than js-like.


## Principles

* Ideally user should not care about placing the nodes, just about connecting the nodes. Layout algorithm should do the best to avoid placing/layout routines, which are basically never related to the actual work.
* Connecting nodes logic is the following. Each node can be focused - in that it will show inputs/outputs connectors, as well as some optional additional info. But that regime encumbers fast connecting nodes, as it requires clicking/focusing the node first. To resolve that, each freshly created node and each not connected node automatically gets "focused" - show it’s output area, as it is supposed that user wants to start connecting that, as far it is not connected. As only the node gets at least one connection - it transforms into "ready" state.