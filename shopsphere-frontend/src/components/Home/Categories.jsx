import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Box,
} from "@mui/material";

import DevicesIcon from "@mui/icons-material/Devices";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

const categories = [
  {
    name: "Electronics",
    icon: <DevicesIcon sx={{ fontSize: 50, color: "#1565C0" }} />,
    products: "120+ Products",
  },
  {
    name: "Fashion",
    icon: <CheckroomIcon sx={{ fontSize: 50, color: "#E91E63" }} />,
    products: "85+ Products",
  },
  {
    name: "Books",
    icon: <MenuBookIcon sx={{ fontSize: 50, color: "#8E24AA" }} />,
    products: "60+ Products",
  },
  {
    name: "Home",
    icon: <HomeIcon sx={{ fontSize: 50, color: "#43A047" }} />,
    products: "90+ Products",
  },
  {
    name: "Gaming",
    icon: <SportsEsportsIcon sx={{ fontSize: 50, color: "#FB8C00" }} />,
    products: "45+ Products",
  },
  {
    name: "Health",
    icon: <HealthAndSafetyIcon sx={{ fontSize: 50, color: "#D81B60" }} />,
    products: "75+ Products",
  },
];

function Categories() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        mb={1}
      >
        Shop by Categories
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        mb={5}
      >
        Explore products from our top categories.
      </Typography>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid
            key={category.name}
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                p: 3,
                textAlign: "center",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Box mb={2}>{category.icon}</Box>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {category.name}
                </Typography>

                <Typography
                  color="text.secondary"
                  mt={1}
                >
                  {category.products}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Categories;