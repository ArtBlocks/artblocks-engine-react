import { ConnectButton } from "@rainbow-me/rainbowkit"
import Box from "@mui/material/Box"

const Connect = () => {
  return (
    <Box>
      <ConnectButton 
        label="Connect"
        chainStatus="icon"
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "full"
        }}
      />
    </Box>
  )
}

export default Connect
