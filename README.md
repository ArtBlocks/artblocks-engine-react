# artblocks-engine
An interface and gallery for a custom Art Blocks Engine contract, heavily modified from the [Art Blocks Engine React Template](https://github.com/ArtBlocks/artblocks-engine-react) repository released under [The MIT License](https://github.com/ArtBlocks/artblocks-engine-react/blob/main/LICENSE). Refer to their [documentation](https://github.com/ArtBlocks/artblocks-engine-react/blob/main/README.md) for more information.

## Warning

This repository serves as a prototype or template. It assumes your core contract is `GenArt721CoreV3` and your minting contract is `MinterDAExpV2` with all sales priced in ETH. It is NOT intended for production use. Please modify for your needs and test extensively before using. Absolutely no warranty of any kind is provided. Please review from The MIT License:

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.**

## Improvements

- Upgrade to ArtBlocks V3 core conract
- Support for dutch auction minter contracts
- Gas limit multiplier buffer (default=1.1)
- Direct retrieval of pricing information from minter contract
- RainbowKit wallet integration
- Improved handling of live token view
- General refactoring
