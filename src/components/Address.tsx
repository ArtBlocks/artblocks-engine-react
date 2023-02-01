import { useEnsName } from "wagmi"
import Tooltip from "@mui/material/Tooltip"

interface Props {
  address?: any
}

const Address = ({ address }: Props) => {
  const ensName = useEnsName({
    address: address,
    chainId: 1
  })

  const shortAddress = address ? `${address.slice(0, 6)}...${ address.slice(38, 42)}` : null

  return (
    address !== null ?
    <Tooltip title={address}>
      <span>{ensName.data || shortAddress}</span>
    </Tooltip>
    : null
  )
}

export default Address