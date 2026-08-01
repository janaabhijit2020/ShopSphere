import {
  Button,
  Stack,
} from "@mui/material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function NavLinks() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const links = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Products",
      path: "/products",
    },
    {
      label: "Recommendations",
      path: "/recommendations",
    },
    {
      label: "AI Assistant",
      path: "/ai-assistant",
    },
    {
      label: "Help",
      path: "/help-support",
    },
  ];

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        alignItems:
          "center",
      }}
    >
      {links.map(
        (link) => (
          <Button
            key={
              link.path
            }
            onClick={() =>
              navigate(
                link.path
              )
            }
            sx={{
              color:
                location.pathname ===
                link.path
                  ? "primary.main"
                  : "text.primary",

              fontWeight:
                location.pathname ===
                link.path
                  ? 700
                  : 500,

              textTransform:
                "none",

              borderRadius:
                2,

              px:
                1.2,

              minWidth:
                "auto",
            }}
          >
            {
              link.label
            }
          </Button>
        )
      )}
    </Stack>
  );
}

export default NavLinks;