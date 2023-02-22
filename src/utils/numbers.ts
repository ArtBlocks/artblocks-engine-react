import { utils, BigNumber } from "ethers"

export const multiplyBigNumberByFloat = function(x: BigNumber, y: number) {
  return BigNumber.from(Math.floor(x.toNumber()*y))
}

export const formatEtherFixed = function(priceWei: string, fractionDigits: number) {
  const priceEther = utils.formatEther(priceWei)
  const priceEtherFixed = parseFloat(priceEther).toFixed(fractionDigits)
  return priceEtherFixed
}