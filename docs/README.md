# Getting Started

The main goal of **magefront** is to provide a way of developing Magento 2 themes in a Node.js environment.

Initially, all the Magento 2 themes are deployed using PHP, which is a very poor solution for frontend development.

All the assets deployment is handled by **magefront**, no need to run `bin/magento setup:static-content:deploy` anymore! 🕊

## Install

Install the package at the root level of your **Magento 2** project:

    npm install magefront

## Usage

    npx magefront build --theme Magento/blank en_US

> This will build the `Magento/blank` theme, with the locale `en_US` into the `pub/static` folder.


## Compatibility

Here is the compatibility list, as of Magento ~2.4.0:

- [x] Magento/blank
- [x] Magento/luma
- [x] Magento/backend
