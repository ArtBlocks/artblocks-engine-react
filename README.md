# artblocks-engine-react

This project is meant ot be used as a template to build Art Blocks Engine web apps.
It contains all of the pages and views necessary for users to browse projects, tokens and be able to purchase mints.

## Quick Start

Run `npm install` or `yarn` to install dependencies.

You will need to create a `.env` configuration file. You can get started by copying `sample.env` and renaming it as `.env`

You will need a JSON RPC provider URL. 
For instance, you could use infura: `https://mainnet.infura.io/v3/<API_KEY>`
You will need to set up JSON RPC urls for each chain you need to support.

You can find the chains configuration in `src/utils/chains.ts`

Run `npm start` or `yarn start` to run the project.

After making any changes to the `.env` file, you will need to restart the app.

## Customizing your configuration

In order to customize `abengine-react` for your specific Art Blocks Engine implementation, you will need to edit the default configuration provided on the `sample.env` file.

First of all, you will need to replace the contract addresses with your own.

You will also need to change the expected `chainId`, graph ql urls and possibly others, to set up `development` or `staging` environments on `testnet` if you wish to do so.

There are additional configuration values you could customize like the number of projects per page, or tokens per page. You will find those parameters in `src/config.ts` 

## Chains configuration

By default, `artblocks-engine-react` supports Ethereum Mainnet, Ropsten and Goerli.
  
____

# Sections and Features

This project includes wallet connection with Metamask, Wallet Connect and coinbase Wallet, implemented using [web3-react](https://github.com/Uniswap/web3-react)

In addition, there are different sections described below:

## Main (Home Page)
The main page includes the following features:
- Header/subheader
- Hero area with most recent project featured
- Title/artist name/description blurb
- Masonry grid of recent projects (max n = 6)

## Project 
Features:
- Breadcrumb nav
- Status/date launched
- Cover image w/ links to live & img views
- Link to token shown as cover
- Title/artist name/# minted
- Mint button
- Description
- License/library
- Artist link/OS link
- Display notes (optional field)
- Code notes (optional field)
- Masonry token grid 
- Sort (by: Newest/oldest)
- Pagination

## Token
Features:
- Breadcrumb nav
- Date minted
- Token cover img w/ links to live & img views
- Owned by: wallet/eth address
- Title/artist name
- Features table
- Etherscan link/OS link

## Project list
Features:
- Masonry grid of projects
- Cover images
- Link to token shown as cover
- Title/artist name
- Description blurb (ellipses after n chars/words)
- Pagination

