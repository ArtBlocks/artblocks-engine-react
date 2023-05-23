import { Button, Typography } from "@mui/material"

interface Props {
  disabled: boolean,
  message: string,
  contractPurchase: any
}

const MintingButton = ({disabled, message, contractPurchase}: Props) => {
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled}
      onClick={() => contractPurchase?.()}
      sx={{
        minWidth: "210px",
        paddingTop: 1.5,
        paddingRight: 1,
        paddingLeft: 1,
        paddingBottom: 1.5,
        boxShadow: "none",
        textTransform: "none"
      }}>
        <Typography fontSize={16} fontWeight={800}>
          {message}
        </Typography>
    </Button>
  )
}

export default MintingButton
