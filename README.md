# Art Blocks Engine (React Template)

This project is meant to be used as a template to build Art Blocks Engine web apps. It contains all of the pages and views necessary for users to browse projects, tokens and be able to purchase mints. This repository serves as a prototype or template. It assumes your core contract is `GenArt721CoreV3` and your minting contract is `MinterDAExpV2` with all sales priced in ETH. It is NOT intended for production use. Please modify for your needs and test extensively before using. Absolutely no warranty of any kind is provided. Please review from The MIT License:

## Warning

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.**

# Quick Start

Run `npm install` or `yarn` to install dependencies.

You will need to create a `.env` configuration file. You can get started by copying `sample.env` and renaming it as `.env`.

Run `npm start` or `yarn start` to run the project.

After making any changes to the `.env` file, you will need to restart the app.

## Customizing your configuration

In order to customize your specific implementation, you will need to edit the default configuration provided on the `sample.env` file. First of all, you will need to replace the contract addresses with your own.

You must specify an API key from [Infura](https://www.infura.io/) as well as a chain id in your environment file. Use `1` for mainnet or `5` for goerli. Alternative providers can be used by modifying the `src/components/Providers.tsx` file. Use multiple `.env` fiels to set up `development` or `staging` environments on `testnet` if you wish to do so.

There are additional configuration values you could customize like the number of projects per page, or tokens per page. You will find those parameters in `src/config.ts`.

# Sections and Features

This project includes wallet connection with [RainbowKit](https://www.rainbowkit.com/) and [wagmi.js](https://wagmi.sh/).

## Lander
- An empty landing page

## Projects
- Header/subheader
- Hero area with most recent project featured
- Title/artist name/description blurb
- Masonry grid of recent projects

## Project 
- Breadcrumb nav
- Status/date launched
- Cover image
- Link to token shown as cover
- Title/artist
- Number of invocations
- Mint button
- Description
- License/library
- Display notes (optional field)
- Code notes (optional field)
- Masonry token grid
- Sort (by date)
- Pagination

## Token
- Breadcrumb nav
- Date minted
- Token cover img with links to live/static views
- Owned by address or ens
- Title/artist name
- Features table
- Etherscan and OpenSea links

## Project list
- Masonry grid of projects
- Cover images
- Link to token shown as cover
- Title/artist name
- Description blurb
- Pagination