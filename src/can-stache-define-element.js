"use strict";

const mixinLifecycleMethods = require("./mixin-lifecycle-methods");
const mixinDefine = require("./mixin-define");
const mixinStacheView = require("./mixin-stache-view");
const mixinViewModelSymbol = require("./mixin-viewmodel-symbol");

const canStacheBindings = require("can-stache-bindings");

const initializeSymbol = Symbol.for("can.initialize");
const teardownHandlersSymbol = Symbol.for("can.teardownHandlers");

function DeriveElement(BaseElement = HTMLElement) {
	return class StacheDefineElement extends
	// add lifecycle methods
	// this needs to happen after other mixins that implement these methods
	// so that this.<lifecycleMethod> is the actual lifecycle method which
	// controls whether the methods farther "down" the chain are called
	mixinLifecycleMethods(
		// mix in viewModel symbol used by can-stache-bindings
		mixinViewModelSymbol(
			// mix in stache renderer from `static view` property
			mixinStacheView(
				// add getters/setters from `static define` property
				mixinDefine(BaseElement)
			)
		)
	) {
		[initializeSymbol](el, tagData) {
			const teardownBindings = canStacheBindings.behaviors.viewModel(
				el,
				tagData,
				function makeViewModel(initialViewmodelData) {
					el.render(initialViewmodelData, {}, tagData.parentNodeList);
					return el;
				}
			);

			if (el[teardownHandlersSymbol]) {
				el[teardownHandlersSymbol].push(teardownBindings);
			}
		}
	};
}

module.exports = DeriveElement();
