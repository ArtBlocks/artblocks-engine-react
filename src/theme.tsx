import * as React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { createTheme, PaletteColor } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { LinkProps } from '@mui/material/Link';

declare module "@mui/material/styles" {
  interface Palette {
    upcoming: PaletteColor;
  }
  interface PaletteOptions {
    upcoming: PaletteColor;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    upcoming: true;
  }
}

const LinkBehavior = React.forwardRef<
  any,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const { palette } = createTheme();

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
      contrastText: 'white',
    },
    secondary: {
      main: '#333',
      contrastText: 'white',
    },
    success: {
      main: '#18CE26',
    },
    error: {
      main: red.A400,
    },
    upcoming: palette.augmentColor({
      color: {
        main: '#CE7A18',
      }
    }),
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

export default theme;
