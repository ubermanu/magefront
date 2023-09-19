---
title: CLI
---

# CLI

Here is a list of available commands:


## build

Process all the source files from different locations to output the result into the `pub/static` folder.
This aims to be as close as possible from the original behavior.

```shell
magefront -t Magento/blank
```


## watch

Enables a watcher on the source directories of the given theme.
When a change is detected, build the theme.

```shell
magefront -t Magento/blank --watch
```

> Only one theme can be watched.


## dev

Run a [BrowserSync](https://browsersync.io/) instance bound to the watcher.
On change, refreshes the `*.css` files or the whole page.

```shell
magefront dev -t Magento/blank --url https://magento.ddev.site
```

> Only one theme can be watched.

## list

List all the available themes in your Magento 2 project files.

```shell
magefront list
```
