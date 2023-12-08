export class DesignModeElement extends HTMLElement {
	/** @type {CSSStyleSheet} */
	static #styleSheet;

  /** @type {HTMLTemplateElement} */
  static #template;

	static {
    this.#styleSheet = new CSSStyleSheet();
    const css = String.raw;
    this.#styleSheet.replaceSync(css`
      :host {
        display: flex;
        gap: 0.5rem;
      }

      [aria-pressed="true"] {
        color-scheme: dark;
      }
    `);

    this.#template = document.createElement("template");

    this.#template.innerHTML = `
      <button part="design-mode-toggle" type="button" name="toggle-design-mode" aria-pressed="false">Design Mode</button>
      <button part="save-changes-button" type="button" name="save-changes">Save Changes</button>
    `;
	}

  static define(tagName = "design-mode") {
    if (!window.customElements.get(tagName)) {
      window[this.name] = this;
      window.customElements.define(tagName, this);
    }
  }

  get designModeToggle() {
    return this.shadowRoot.querySelector("[part=design-mode-toggle]");
  }

  get saveChangesButton() {
    return this.shadowRoot.querySelector("[part=save-changes-button]");
  }

	constructor() {
		super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.adoptedStyleSheets = [this.constructor.#styleSheet];
    this.shadowRoot.appendChild(this.constructor.#template.content.cloneNode(true));

    this.designModeToggle.addEventListener("click", this);
    this.saveChangesButton.addEventListener("click", this);
	}

  get on() {
    const value = this.getAttribute("on");
    return value === "" || value === "on";
  }

  set on(flag) {
    if (typeof flag !== "boolean") throw new TypeError(`Was expecting a boolean, but got a ${typeof flag}`);
    this.toggleAttribute("on", flag);
  }

  static get observedAttributes() { return ["on"]; }

  attributeChangedCallback(_name, _oldValue, newValue) {
    const valueAsBoolean = newValue === "" || newValue === "on";

    this.ownerDocument.designMode = valueAsBoolean ? "on" : "off";
    this.designModeToggle.setAttribute("aria-pressed", valueAsBoolean ? "true" : "false");
  }

  handleEvent(event) {
    if (event.type === "click") {
      if (event.currentTarget.name === "toggle-design-mode") this.on = !this.on;
      else if (event.currentTarget.name === "save-changes") this.saveChanges();
    }
  }

  async saveChanges() {
    try {
      const fileHandle = await window.showSaveFilePicker({
        types: [
          {
            suggestedName: "saved-changes.html",
            description: "HTML Document",
            accept: { "text/html": [".html"] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(this.ownerDocument.documentElement.outerHTML);
      await writable.close();
    } catch (error) {
      // TODO: handle error
      console.error(error.name, error.message);
    }
  }
}
