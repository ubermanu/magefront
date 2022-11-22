# CLI

Here is a list of available commands:


## build

Process all the source files from different locations to output the result into the `pub/static` folder.\
This aims to be as close as possible from the native behavior (PHP).

    magefront -t Magento/blank


## watch

Enables a watcher on the source directories of the given theme.\
When a change is detected, build the theme.

    magefront -t Magento/blank --watch


## dev

Run a [BrowserSync](https://browsersync.io/) instance bound to the watcher.\
On change, refreshes the `*.css` files or the whole page.

    magefront -t Magento/blank --dev https://magento.ddev.site
