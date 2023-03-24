import { useState } from "react"
import {
  Box,
  Link,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import Connect from "components/Connect"

const items = [
  {
    label: "Projects",
    url: "/projects",
    enabled: true
  }
]

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{textAlign: "center"}}>
      <List dense>
        {items.map((item) => (
          <ListItem sx={{"&:hover": {backgroundColor: "#f5f5f5"}}} key={item.label} disablePadding>
            <ListItemButton component={Link} href={item.url} sx={{textAlign: "left", pointerEvents: item.enabled ? "auto" : "none"}}>
              <ListItemText primary={item.label} primaryTypographyProps={{fontSize: 18, fontWeight: 600, color: item.enabled ? "black" : "lightgrey"}}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
  return (
    <Box sx={{width: "100%", display: "flex", justifyContent: "center", backgroundColor: "black"}}>
      <AppBar component="nav" position="static" elevation={1} sx={{backgroundColor: "black", boxShadow: 0}}>
        <Toolbar sx={{width: "100%", display: "flex", margin: "auto", justifyContent: "space-between", backgroundColor: "white"}}>
          <Box sx={{display: "flex", backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
            <IconButton
              color="default"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{mr: 2, display: {sm: "none"}}}>
              <MenuIcon/>
            </IconButton>
            <Box sx={{paddingRight: "25px"}}>
              <Link href="/" sx={{display: "flex"}}>
                <img src="/media/logo.svg" alt="artblocks" height={26}></img>
              </Link>
            </Box>
            <Box sx={{display: {xs: "none", sm: "block"}, marginTop: "5px"}}>
              {items.map((item) => (
                  <Link
                  key={item.label}
                  href={item.url}
                  underline="hover"
                  sx={{fontSize: 18, fontWeight: 600, color: item.enabled ? "black" : "lightgrey", paddingRight: "25px", pointerEvents: item.enabled ? "auto" : "none"}}>
                  {item.label}
                </Link>
              ))}
            </Box>
          </Box>
          <Box>
            <Connect/>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{keepMounted: true}}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
}

export default Header
