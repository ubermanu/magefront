# CLI

Here is a list of available commands:


## list

Outputs a table of all the themes available in your project.

    magefront list


## build

Process all the source files from different locations to output the result into the `pub/static` folder.\
This aims to be as close as possible from the native behavior (PHP).

    magefront build -t Magento/blank


## watch

Enables a watcher on the source directories of the given theme.\
When a change is detected, build the theme.

    magefront watch -t Magento/blank


## dev

Run a [BrowserSync](https://browsersync.io/) instance bound to the watcher.\
On change, refreshes the `*.css` files or the whole page.

    magefront dev -t Magento/blank
