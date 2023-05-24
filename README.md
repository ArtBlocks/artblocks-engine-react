# Art Blocks Engine (React Template)
[![GitPOAPs](https://public-api.gitpoap.io/v1/repo/ArtBlocks/artblocks-engine-react/badge)](https://www.gitpoap.io/gh/ArtBlocks/artblocks-engine-react)

This project is meant to be used as a template to build Art Blocks Engine web apps. It contains all pages and views
necessary for users to browse projects, tokens and be able to purchase mints. This repository serves as a prototype or
template.

It assumes your core contracts are either `GenArt721CoreV2` or `GenArt721CoreV3`, and supports the following minters:
`GenArt721Minter`, `MinterSetPriceV4`, `MinterSetPriceERC20V4`, `MinterMerkleV5`, and `MinterHolderV4`.

It is NOT intended for production use as-is. Please modify for your needs and test extensively before using.

Absolutely no warranty of any kind is provided. Please review from The MIT License:

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

To run the project locally you will need to create a `.env` configuration file. You can get started by copying
`sample.env` and renaming it as `.env`.

Run `npm start` or `yarn start` to run the project locally.

After making any changes to the `.env` file, you will need to restart the app.

The default values specified in the provided `sample.env` file are reflected in the demo hosting found at:
https://artblocks-engine-react.vercel.app/

**Important note:** if you are planning to run/host this template via Vercel, you will populate these environment
variables in the Vercel "Environment Variables" settings rather than defining them in your local `.env` file.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FArtBlocks%2Fartblocks-engine-react&env=REACT_APP_EXPECTED_CHAIN_ID,REACT_APP_GRAPHQL_URL,REACT_APP_INFURA_KEY&envDescription=Required%20environment%20variables%20for%20deployment&envLink=https%3A%2F%2Fgithub.com%2FArtBlocks%2Fartblocks-engine-react%2Fblob%2Fmain%2Fsample.env)

## Customizing your configuration

In order to customize your specific implementation, you will need to edit the default configuration provided on the
`sample.env` file.

You must specify an API key from [Infura](https://www.infura.io/) as well as a chain id in your environment file. Use
`1` for mainnet or `5` for goerli. Alternative providers can be used by modifying the `src/components/Providers.tsx`
file. Use multiple `.env` fiels to set up `development` or `staging` environments on `testnet` if you wish to do so.

Additionally, you will need to edit the default configuration in the `src/contractConfig.ts` file -
here you will find arrays for your mainnet and testnet contracts. Further configuration values like the number of
projects per page, tokens per page, etc. can be found in `src/config.ts`.

**Important note:** if you intend to support either of the `MinterMerkleV5` or `MinterHolderV4` minters there are a few
extra necessary requirements and configurations.

Support for the `MinterMerkleV5` minter requires a custom API endpoint that is responsible for calculating the merkle
root for a given wallet address - the url for this endpoint must be configured in the `.env` file with the
`REACT_APP_MERKLE_PROOF_API_URL` key. It is assumed that this endpoint takes the following url parameters:
`?contractAddress={}&projectId={}&walletAddress={}` - this can be customized in the
`src/components/MinterInterfaces/MinterMerkleV5Interface.tsx` file. For an example of this endpoint please see
[here](https://github.com/plottables/media/blob/main/pages/api/getMerkleProof.tsx).

Support for the `MinterHolderV4` minter requires a custom API endpoint that is responsible for determining the holder
proof for a given wallet address - the url for this endpoint must be configured in the `.env` file with the
`REACT_APP_HOLDER_PROOF_API_URL` key. It is assumed that this endpoint takes the following url parameters:
`?contractAddress={}&projectId={}&walletAddress={}&isMainnet={}` - this can be customized in the
`src/components/MinterInterfaces/MinterHolderV4Interface.tsx` file. For an example of this endpoint please see
[here](https://github.com/plottables/media/blob/main/pages/api/getHolderProof.tsx).

# Sections and Features

This project includes wallet connection with [RainbowKit](https://www.rainbowkit.com/) and
[wagmi.js](https://wagmi.sh/).

## Lander
- An empty landing page

## Projects
- Header/subheader
- Title/artist name/description blurb
- Grid of recent projects

## Project
- Breadcrumb nav
- Status
- Cover image
- Link to token shown as cover
- Title/artist
- Number of invocations
- Mint button
- Description
- License/library
- Token grid
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
- Grid of projects
- Cover images
- Link to token shown as cover
- Title/artist name
- Description blurb
- Pagination

## Owned Tokens
- List of projects with tokens owned by wallet
- Title/artist name with link to project page
- Images/Links to owned tokens with pagination
- Pagination
