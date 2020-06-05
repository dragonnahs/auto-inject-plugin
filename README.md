### auto-inject-plugin
------------
A plugin that automatically injects dependent files.

### Introduction
------------

After splitting the third-party package, it is automatically injected into the corresponding page.

### Installation
------------
First, install the package as a dependency in your package.json:
```
yarn add -D auto-inject-plugin

```

### Usage
------------

Next, in your Webpack config, require() the preload plugin as follows:

```
const AutoInjectPlugin = require('auto-inject-plugin')

```
and finally, configure the plugin in your Webpack plugins array after HtmlWebpackPlugin:

```
plugins: [
  new HtmlWebpackPlugin(),
  new AutoInjectPlugin()
]

```

