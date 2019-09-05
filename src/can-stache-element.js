"use strict";

const mixinLifecycleMethods = require("./mixin-lifecycle-methods");
const mixinProps = require("./mixin-props");
const mixinStacheView = require("./mixin-stache-view");
const mixinViewModelSymbol = require("./mixin-viewmodel-symbol");
const mixinBindings = require("./mixin-bindings");
const mixinInitializeBindings = require("./mixin-initialize-bindings");
const mixinBindBehaviour = require("./mixin-bind-behaviour");
const { initializeObservedAttributes } = require("./mixin-bind-behaviour");

const canStacheBindings = require("can-stache-bindings");
const { createConstructorFunction } = require("can-observable-mixin");

const initializeSymbol = Symbol.for("can.initialize");
const teardownHandlersSymbol = Symbol.for("can.teardownHandlers");

function DeriveElement(BaseElement = HTMLElement) {
	class StacheElement extends
	// add lifecycle methods
	// this needs to happen after other mixins that implement these methods
	// so that this.<lifecycleMethod> is the actual lifecycle method which
	// controls whether the methods farther "down" the chain are called
	mixinLifecycleMethods(
		// mixin .bindings() method and behavior
		mixinBindings(
			// Find all prop definitions and extract `{ bind: () => {} }` for binding initialization
			mixinBindBehaviour(
				// Initialize the bindings
				mixinInitializeBindings(
					// mix in viewModel symbol used by can-stache-bindings
					mixinViewModelSymbol(
						// mix in stache renderer from `static view` property
						mixinStacheView(
							// add getters/setters from `static props` property
							mixinProps(BaseElement)
						)
					)
				)
			)
		)
	) {
		[initializeSymbol](el, tagData) {


			const teardownBindings = canStacheBindings.behaviors.viewModel(
				el,
				tagData,
				function makeViewModel(initialViewmodelData) {
					el.render(initialViewmodelData);
					return el;
				}
			);

			if (el[teardownHandlersSymbol]) {
				el[teardownHandlersSymbol].push(teardownBindings);
			}
		}
	}

	const StacheElementConstructorFunction = createConstructorFunction(
		StacheElement
	);

	// Initialize the `observedAttributes`
	initializeObservedAttributes(StacheElementConstructorFunction);

	return StacheElementConstructorFunction;
}

module.exports = DeriveElement();
