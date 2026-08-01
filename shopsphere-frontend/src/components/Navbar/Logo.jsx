import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Typography
      component={Link}
      to="/"
      variant="h5"
      sx={{
        textDecoration: "none",
        color: "#1565C0",
        fontWeight: 800,
        letterSpacing: "1px",
        transition: "0.3s",
        "&:hover": {
          color: "#0D47A1",
        },
      }}
    >
      ShopSphere
    </Typography>
  );
}

export default Logo;