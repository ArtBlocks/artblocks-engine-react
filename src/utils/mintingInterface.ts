import MintingInterfaceV3 from "components/MintingInterfaceV3";
import MintingInterfaceV2 from "components/MintingInterfaceV2";
import MinterSetPriceV4 from "components/V3MinterInterfaces/MinterSetPriceV4";
import MinterDAExpV4 from "components/V3MinterInterfaces/MinterDAExpV4";
import MinterMerkleV5 from "components/V3MinterInterfaces/MinterMerkleV5";

export const getMintingInterface = (contractVersion: string) => {
    if (contractVersion === "V3") return MintingInterfaceV3
    if (contractVersion === "V2") return MintingInterfaceV2
    return null
}

export const getV3MinterType = (minterType: string) => {
    if (minterType === "MinterDAExpV4") return MinterDAExpV4
    if (minterType === "MinterSetPriceV4") return MinterSetPriceV4
    if (minterType === "MinterMerkleV5") return MinterMerkleV5
    return null
}
