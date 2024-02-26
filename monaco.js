function registerToForm(editor) {}

class MonacoEditor extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<div id="container" style="width:800px;height:200px;border:1px solid grey"></div>`;
    this.contentType = this.getAttribute("content-type");
    this.name = this.getAttribute("name");
  }
  static get observedAttributes() {
    return ["content-type", "name"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "content-type") {
      this.contentType = newValue;
    }
    if (name === "name") {
      this.name = newValue;
      this.onNameChange();
    }
  }

  /**
   * Register the editor to the form
   * @param {FormDataEvent} event
   */
  registerToForm(event) {
    const value = monaco.editor.getModels()[0].getValue();
    const blob = new Blob([value], { type: this.contentType });
    event.formData.append(this.name, blob, "resource.json");
  }

  onNameChange() {
    this.closest("form").addEventListener("formdata", (event) =>
      this.registerToForm(event),
    );
  }

  async connectedCallback() {
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs",
      },
    });
    const container = this.firstChild;
    require(["vs/editor/editor.main"], function () {
      monaco.editor.create(container, {
        value: "const value = 'Hello, world!';",
        language: "javascript",
        automaticLayout: true,
      });
    });
  }
}

customElements.define("monaco-editor", MonacoEditor);
