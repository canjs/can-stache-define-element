@module {function} can-stache-define-element
@parent can-views
@collection can-ecosystem
@group can-stache-define-element/static 0 static
@group can-stache-define-element/lifecycle-methods 1 lifecycle methods
@group can-stache-define-element/lifecycle-hooks 2 lifecycle hooks
@alias can.StacheDefineElement
@outline 2

@description Create a custom element with [can-define well-defined] properties and [can-stache stache views].

@signature `StacheDefineElement`

  `can-stache-define-element` exports a `StacheDefineElement` class used to define custom elements.

  Extend `StacheDefineElement` with a:

  - `static view` - A [can-stache stache] view.
  - `static define` - [can-define-object DefineObject]-like property definitions.
  - getters, setters, and methods.
  - lifecycle hooks - [can-stache-define-element/lifecycle-hooks.connected] and [can-stache-define-element/lifecycle-hooks.disconnected].

  The following defines a  `<count-er>` element:

  ```html
  <count-er></count-er>
  <script type="module">
  import { StacheDefineElement } from "can/everything";
  class Counter extends StacheDefineElement {
	  static view = `
		  Count: <span>{{this.count}}</span>
		  <button on:click="this.increment()">+1</button>
	  `;
	  static define = {
		  count: 0
	  };
	  increment() {
		  this.count++;
	  }
  }
  customElements.define("count-er", Counter);
  </script>
  ```
  @codepen

  To create a component instance, either:

  - Write the element tag and [can-stache-bindings bindings] in a [can-stache] template like:
    ```html
    <count-er count:from="5"/>
    ```
  - Write the component tag in an HTML page:
    ```html
    <count-er></count-er>
    ```
  - Create an instance of the class programmatically like:
    ```js
    const myCounter = new Counter();
    document.body.appendChild(myCounter);
    myCounter.count = 6;
    myCounter.innerHTML; //-> Count: <span>6</span>...
    ```

@body

## Basic Use

The following sections cover everything you need to create a custom element with `StacheDefineElement`.

### Defining a custom element with a StacheDefineElement constructor

In order to create a basic custom element with `StacheDefineElement`, create a class that extends `StacheDefineElement` and call [customElements.define](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) with the tag for the element and the constructor:

```html
<count-er></count-er>
<script type="module">
import { StacheDefineElement } from "can/everything";
class Counter extends StacheDefineElement {
}
customElements.define("count-er", Counter);
</script>
```
@highlight 6,only
@codepen

This custom element can be used by putting a `<count-er></count-er>` tag in an HTML page.

### Defining an element's view

To create a [can-stache] view for the element, add a [can-stache-define-element/static.view static view] property to the class:

```html
<count-er></count-er>
<script type="module">
import { StacheDefineElement } from "can/everything";
class Counter extends StacheDefineElement {
	static view = `
		Count: <span>{{this.count}}</span>
		<button on:click="this.increment()">+1</button>
	`;
}
customElements.define("count-er", Counter);
</script>
```
@codepen
@highlight 5-8

### Defining an element's properties

Properties can be defined using a [can-stache-define-element/static.define static define] object:

```html
<count-er></count-er>
<script type="module">
import { StacheDefineElement } from "can/everything";
class Counter extends StacheDefineElement {
	static view = `
		Count: <span>{{this.count}}</span>
		<button on:click="this.increment()">+1</button>
	`;
	static define = {
		count: 6
	};
}
customElements.define("count-er", Counter);
</script>
```
@codepen
@highlight 9-11,only

### Defining Methods, Getters, and Setters

Methods (as well as getters and setters) can be added to the class body as well:

```html
<count-er></count-er>
<script type="module">
import { StacheDefineElement } from "can/everything";
class Counter extends StacheDefineElement {
	static view = `
		Count: <span>{{this.count}}</span>
		<button on:click="this.increment()">+1</button>
	`;
	static define = {
		count: 6
	};
	increment() {
		this.count++;
	}
}
customElements.define("count-er", Counter);
</script>
```
@codepen
@highlight 12-14,only

### Lifecycle hooks

If needed, [can-stache-define-element/lifecycle-hooks.connected] and [can-stache-define-element/lifecycle-hooks.disconnected] lifecycle hooks can be added to the class body. These will be called when the element is added and removed from the page, respectively.

```html
<button id="add">Add Timer</button>
<button id="remove">Remove Timer</button>
<script type="module">
import { StacheDefineElement } from "can/everything";

class Timer extends StacheDefineElement {
	static view = `
		<p>{{this.time}}</p>
	`;
	static define = {
		time: { type: Number, default: 0 },
		timerId: Number
	};
	connected() {
		this.timerId = setInterval(() => {
			this.time++;
		}, 1000);
		console.log("connected");
	}
	disconnected() {
		clearInterval(this.timerId);
		console.log("disconnected");
	}
}
customElements.define("time-er", Timer);

let timer;
document.body.querySelector("button#add").addEventListener("click", () => {
	timer = document.createElement("time-er");
	document.body.appendChild(timer);
});

document.body.querySelector("button#remove").addEventListener("click", () => {
	document.body.removeChild(timer);
});
</script>
```
@codepen
@highlight 14-23,only

## Testing

There are lifecycle methods available to simulate parts of an element's lifecycle that would normally be triggered through the [custom element lifecycle](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks).

### Testing an element's properties and methods

To test an element's properties and methods, call the [can-stache-define-element/lifecycle-methods.initialize] method with any initial property values:


```js
import { StacheDefineElement } from "can/everything";
class Counter extends StacheDefineElement {
	static view = `
		Count: <span>{{this.count}}</span>
		<button on:click="this.increment()">+1</button>
	`;
	static define = {
		count: 6
	};
	increment() {
		this.count++;
	}
}
customElements.define("count-er", Counter);
const counter = new Counter();
counter.initialize({ count: 20 });

counter.count === 20; // -> true

counter.increment();
counter.count === 21; // -> true
```
@codepen
@highlight 15,only

### Testing an element's view

To test an element's view, call the [can-stache-define-element/lifecycle-methods.render] method with any initial property values:

```js
import { StacheDefineElement } from "can/everything";
class Counter extends StacheDefineElement {
	static view = `
		Count: <span>{{this.count}}</span>
		<button on:click="this.increment()">+1</button>
	`;
	static define = {
		count: 6
	};
	increment() {
		this.count++;
	}
}
customElements.define("count-er", Counter);
const counter = new Counter();
counter.render({ count: 20 });

counter.firstElementChild.innerHTML === "20"; // -> true

counter.increment();
counter.firstElementChild.innerHTML === "21"; // -> true
```
@codepen
@highlight 15,only

### Testing an element's lifecycle hooks

To test the functionality of the `connected` or `disconnected` hooks, you can call the [can-stache-define-element/lifecycle-methods.connect] or [can-stache-define-element/lifecycle-methods.disconnect] method.

```js
import { StacheDefineElement } from "can/everything";

class Timer extends StacheDefineElement {
	static view = `
		<p>{{this.time}}</p>
	`;
	static define = {
		time: { type: Number, default: 0 },
		timerId: Number
	};
	connected() {
		this.timerId = setInterval(() => {
			this.time++;
		}, 1000);
	}
	disconnected() {
		clearInterval(this.timerId);
	}
}
customElements.define("time-er", Timer);

const timer = new Timer();
timer.connect();

timer.firstElementChild; // -> <p>0</p>

// ...some time passes
timer.firstElementChild; // -> <p>42</p>

timer.disconnect();

// ...some moretime passes
timer.firstElementChild; // -> <p>42</p>
```
@codepen
@highlight 11-18,23,30,only
