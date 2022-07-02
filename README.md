# pbab-react

This project is meant ot be used as a template to build Art Blocks Engine web apps.
It contains all of the pages and views necessary for users to browse projects, tokens and be able to purchase mints.

## Quick Start

Run `npm install` or `yarn` to install dependencies.

You will need to create a `.env` configuration file. You can get started by copying `sample.env` and renaming it as `.env`

You will need to get a **Project ID** and a **Project Key** from Infura in order to run the project.
To obtain these, you can create a free account at [infura.io](https://infura.io/)


Then set up those values as `REACT_APP_INFURA_PROJECT_ID` and `REACT_APP_INFURA_KEY` respectively.

Run `npm start` or `yarn start` to run the project.

After making any changes to the `.env` file, you will need to restart the app.

## Customizing your configuration

In order to customize `pbab-react` for your specific Art Blocks Engine implementation, you will need to edit the default configuration provided on the `sample.env` file.

First of all, you will need to replace the contract addresses with your own.

You will also need to change the expected `chainId`, graph ql urls and possibly others, to set up `development` or `staging` environments on `testnet` if you wish to do so.

There are additional configuration values you could customize like the number of projects per page, or tokens per page. You will find those parameters in `src/config.ts` 

## Chains configuration

By default, `pbab-react` supports Ethereum Mainnet, Ropsten and Goerli.

You can find the chains configuration on `src/utils/chains.ts`
In most cases, you won't need to change anything in that file, just set up the expected chainId on your `.env` file.
