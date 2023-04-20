import MintingInterfaceV3 from "components/MintingInterfaceV3";
import MintingInterfaceV2 from "components/MintingInterfaceV2";

export const getMintingInterface = (contractVersion: string) => {
    if (contractVersion == "V3") return MintingInterfaceV3
    if (contractVersion == "V2") return MintingInterfaceV2
    return null
}
