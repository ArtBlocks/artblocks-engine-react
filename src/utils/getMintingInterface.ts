import GenArt721MinterInterface from "components/MinterInterfaces/GenArt721MinterInterface"
import MinterSetPriceV4Interface from "components/MinterInterfaces/MinterSetPriceV4Interface"
import MinterDAExpV4Interface from "components/MinterInterfaces/MinterDAExpV4Interface"
import MinterMerkleV5Interface from "components/MinterInterfaces/MinterMerkleV5Interface"
import MinterHolderV4Interface from "components/MinterInterfaces/MinterHolderV4Interface"
import MinterSetPriceERC20V4Interface from "components/MinterInterfaces/MinterSetPriceERC20V4Interface"
import MinterDAExpSettlementV1Interface from "components/MinterInterfaces/MinterDAExpSettlementV1Interface"

export const getMintingInterface = (contractVersion: string, minterType: string | null) => {
  if (contractVersion === "V2") {
    return GenArt721MinterInterface
  } else if (contractVersion === "V3") {
    if (minterType === "MinterDAExpV4") return MinterDAExpV4Interface
    if (minterType === "MinterSetPriceV4") return MinterSetPriceV4Interface
    if (minterType === "MinterMerkleV5") return MinterMerkleV5Interface
    if (minterType === "MinterHolderV4") return MinterHolderV4Interface
    if (minterType === "MinterSetPriceERC20V4") return MinterSetPriceERC20V4Interface
    if (minterType === "MinterDAExpSettlementV1") return MinterDAExpSettlementV1Interface
  }
  return null
}
