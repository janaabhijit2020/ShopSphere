import {
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";

function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: "#FAF7F2",
        color: "#1F2937",

        overflowX: "auto",

        scrollbarWidth: "none",

        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          gap: 3,

          py: 1,

          minWidth:
            "max-content",

          width:
            "max-content",

          px: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <Logo />

        <SearchBar />

        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            gap: 3,

            flexShrink:
              0,
          }}
        >
          <NavLinks />

          <NavActions />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;