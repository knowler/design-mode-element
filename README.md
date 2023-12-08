# Design Mode Element

A custom element to switch [design mode](https://developer.mozilla.org/en-US/docs/Web/API/Document/designMode) on and off. Also, allows you to save your changes. **Work in progress! API and functionality subject to change.** See the [demo](https://knowler.github.io/design-mode-element/demo).

## Defining

Define it the standard way or use the helper method:

```javascript
import { DesignModeElement } from "https://esm.sh/gh/knowler/design-mode-element/design-mode-element.js?raw";

DesignModeElement.define();
```

You can pass in your own tag name if you’d like.

## Usage

```html
<design-mode></design-mode>
```

Start with it on:

```html
<design-mode on></design-mode>
```

## Customization

I’ll probably add some slots for providing your own elements in the future. For now the parts are exposed.

```css
design-mode::part(design-mode-toggle) {
	font-family: Comic Sans MS;
}

design-mode::part(save-changes-button) {
	color: DeepPink;
}
```
