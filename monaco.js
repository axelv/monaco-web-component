class MonacoEditor extends HTMLElement {
  constructor() {
    super();
    const classname = this.getAttribute("class") || "";
    const style = this.getAttribute("style") || "";
    this.innerHTML = `<div style="border:1px solid grey;${style}" class="${classname}"></div>`;
    this.language = this.getAttribute("language") || "json";
    this.contentType = this.getAttribute("content-type");
    this.name = this.getAttribute("name");
    this.filename = this.getAttribute("filename");
    const rawSchema = this.getAttribute("schema");
    this.schema = this.parseSchema(rawSchema);
    this.defaultValue = this.getAttribute("defaultvalue");
  }

  /**
   * Parse the schema attribute
   * @param {string} rawSchema
   * @returns {object}
   */
  parseSchema(rawSchema) {
    if (!rawSchema) null;
    try {
      return JSON.parse(rawSchema);
    } catch (error) {
      console.error("Error parsing schema", error);
      return null;
    }
  }

  static get observedAttributes() {
    return ["content-type", "name", "filename"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "content-type") {
      this.contentType = newValue;
    }
    if (name === "name") {
      this.name = newValue;
      this.onNameChange();
    }
    if (name === "filename") {
      this.filename = newValue;
    }
  }

  /**
   * Register the editor to the form
   * @param {FormDataEvent} event
   */
  registerToForm(event) {
    const value = monaco.editor.getModels()[0].getValue();
    const blob = new Blob([value], { type: this.contentType });
    event.formData.append(this.name, blob, this.filename);
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
    const value = this.defaultValue;
    const schema = this.schema;
    const language = this.language;
    require(["vs/editor/editor.main"], function () {
      if (schema) {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          schemas: [
            {
              uri: "http://monaco-web-component/schema.json",
              fileMatch: ["*"],
              schema,
            },
          ],
        });
      }
      monaco.editor.create(container, {
        value,
        language,
        automaticLayout: true,
      });
    });
  }
}

customElements.define("monaco-editor", MonacoEditor);
