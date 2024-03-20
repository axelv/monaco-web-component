# Monaco Editor Web Component

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/axelv21/monaco-web-component)

This web component wraps the [monaco editor](https://microsoft.github.io/monaco-editor) and provides a simple way to integrate it into your HTMLForms.

## Demo

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="index.html">
  </template>
</custom-element-demo>
```
-->

```html
<monaco-editor
  name="code"
  language="javascript"
  theme="vs-dark"
  value="console.log('Hello, World!')"
  contenttype="application/javascript"
  filename="example.js"
></monaco-editor>
```
