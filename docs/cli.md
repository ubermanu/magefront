---
title: CLI
---

# CLI

Here is a list of available commands:


## build

Process all the source files from different locations to output the result into the `pub/static` folder.
This aims to be as close as possible from the original behavior.

```shell
magefront build -t Magento/blank
```

The argument provided is the `locale` to build:

```shell
magefront build en_US
```

You can load the configuration from the `magefront.config.js` file:

```shell
magefront build -c
```

Or from a custom file:

```shell
magefront build -c my-config.js
```

If no `theme` is provided, all the themes will be generated:

```shell
magefront build
```

Also, build is the default command, so you can just run:

```shell
magefront
```


## watch

Enables a watcher on the source directories of the given theme.
When a change is detected, build the theme.

```shell
magefront build -t Magento/blank --watch
```

> Only one theme can be used in watch mode.


## dev

Run a [BrowserSync](https://browsersync.io/) instance bound to the watcher.
On change, refreshes the `*.css` files or the whole page.

```shell
magefront dev -t Magento/blank --url https://magento.ddev.site
```

> Only one theme can be used in dev mode.

## list

List all the available themes in your Magento 2 project files.

```shell
magefront list
```
