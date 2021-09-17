### auto-inject-plugin-upgrade
------------
A plugin that automatically injects dependent files.

### Introduction
------------

After splitting the third-party package, it is automatically injected into the corresponding page.

### Installation
------------
First, install the package as a dependency in your package.json:
```
yarn add -D auto-inject-plugin-upgrade

```

### Usage
------------

Next, in your Webpack config, require() the preload plugin as follows: 

```
const AutoInjectPlugin = require('auto-inject-plugin-upgrade')

```
and finally, configure the plugin in your Webpack plugins array after HtmlWebpackPlugin:

```
plugins: [
  new HtmlWebpackPlugin(),
  new AutoInjectPlugin()
]

```

