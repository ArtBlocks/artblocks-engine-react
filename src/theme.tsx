import * as React from "react"
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from "react-router-dom"
import { createTheme, PaletteColor } from "@mui/material/styles"
import { LinkProps } from "@mui/material/Link"

declare module "@mui/material/styles" {
  interface Palette {
    upcoming: PaletteColor
  }
  interface PaletteOptions {
    upcoming: PaletteColor
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    upcoming: true
  }
}

const LinkBehavior = React.forwardRef<
  any,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />
})

const { palette } = createTheme()

const theme = createTheme({
  palette: {
    primary: {
      main: "#212121",
      contrastText: "#ECF0F1"
    },
    secondary: {
      main: "#2C3E50",
      contrastText: "#ECF0F1"
    },
    success: {
      main: "#27AE60"
    },
    error: {
      main: "#E74C3C"
    },
    upcoming: palette.augmentColor({
      color: {
        main: "#CE7A18"
      }
    })
  },
  typography: {
    fontFamily: [
      "Raleway",
      "Geometric",
      "Segoe UI",
      "Helvetica Neue",
      "Arial",
      "sans-serif"
    ].join(",")
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior
      } as LinkProps
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior
      }
    }
  }
})

theme.typography.h1 = {
  fontFamily: "Archivo Black",
  fontWeight: "400"
}

export default theme