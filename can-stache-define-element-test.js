const QUnit = require("steal-qunit");
const StacheDefineElement = require("./can-stache-define-element");

QUnit.module("can-stache-define-element");

QUnit.test("basics", function(assert) {
	const fixture = document.querySelector("#qunit-fixture");

	class Input extends StacheDefineElement {
		static get view() {
			return `<p><input value:bind="this.inputValue" on:change="this.handleChange(scope.element.value)"></p>`;
		}

		handleChange(val) {
			// call the handler passed in through bindings
			this.handler(val);
		}
	}
	customElements.define("in-put", Input);

	class Basic extends StacheDefineElement {
		static get view() {
			return `
				<in-put inputValue:bind="this.first" handler:from="this.setFirst"></in-put>
				<in-put inputValue:bind="this.last" handler:from="this.setLast"></in-put>
				<p>{{this.fullName}}</p>
			`;
		}

		static get define() {
			return {
				first: { Type: String, default: "Kevin" },
				last: { Type: String, default: "McCallister" }
			};
		}

		get fullName() {
			return `${this.first} ${this.last}`;
		}

		setFirst(val) {
			this.first = val;
		}

		setLast(val) {
			this.last = val;
		}
	}
	customElements.define("basic-app", Basic);
	const el = document.createElement("basic-app");
	fixture.appendChild(el);

	const inputs = el.querySelectorAll("input");
	const firstNameInput = inputs[0];
	const lastNameInput = inputs[1];
	const fullNameP = el.querySelectorAll("p")[2];

	assert.equal(firstNameInput.value, "Kevin", "firstName input has correct default value");
	assert.equal(lastNameInput.value, "McCallister", "lastName input has correct default value");
	assert.equal(fullNameP.innerHTML, "Kevin McCallister", "fullName paragraph has correct default value");

	firstNameInput.value = "Marty";
	firstNameInput.dispatchEvent(new Event("change"));
	assert.equal(fullNameP.innerHTML, "Marty McCallister", "fullName paragraph changes when firstName input changes");

	lastNameInput.value = "McFly";
	lastNameInput.dispatchEvent(new Event("change"));
	assert.equal(fullNameP.innerHTML, "Marty McFly", "fullName paragraph changes when lastName input changes");
});
