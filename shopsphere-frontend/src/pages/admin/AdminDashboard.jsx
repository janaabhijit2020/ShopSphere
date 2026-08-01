import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import { getAllProducts } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import { getAllAdminOrders } from "../../services/adminOrderService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [productCount, setProductCount] =
    useState(0);

  const [categoryCount, setCategoryCount] =
    useState(0);

  const [orderCount, setOrderCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboardData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            productResponse,
            categoryResponse,
            orderResponse,
          ] = await Promise.all([
            getAllProducts(),
            getAllCategories(),
            getAllAdminOrders(),
          ]);

          setProductCount(
            Array.isArray(
              productResponse.data
            )
              ? productResponse.data.length
              : 0
          );

          setCategoryCount(
            Array.isArray(
              categoryResponse.data
            )
              ? categoryResponse.data.length
              : 0
          );

          setOrderCount(
            Array.isArray(
              orderResponse.data
            )
              ? orderResponse.data.length
              : 0
          );
        } catch (error) {
          console.error(
            "Unable to load admin dashboard:",
            error
          );

          setError(
            error.response?.data?.message ||
              "Unable to load dashboard data."
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboardData();
  }, []);

  const dashboardCards = [
    {
      title: "Total Products",
      value: productCount,
      description:
        "Products available in ShopSphere",
      icon: (
        <Inventory2OutlinedIcon
          sx={{
            fontSize: 34,
          }}
        />
      ),
      path: "/admin/products",
    },

    {
      title: "Total Categories",
      value: categoryCount,
      description:
        "Product categories available",
      icon: (
        <CategoryOutlinedIcon
          sx={{
            fontSize: 34,
          }}
        />
      ),
      path: "/admin/categories",
    },

    {
      title: "Total Orders",
      value: orderCount,
      description:
        "Customer orders received",
      icon: (
        <ShoppingBagOutlinedIcon
          sx={{
            fontSize: 34,
          }}
        />
      ),
      path: "/admin/orders",
    },

    {
      title: "Customers",
      value: "Manage",
      description:
        "View registered customers",
      icon: (
        <PeopleAltOutlinedIcon
          sx={{
            fontSize: 34,
          }}
        />
      ),
      path: "/admin/customers",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: {
          xs: 3,
          md: 5,
        },
        backgroundColor:
          "#f5f7fb",
      }}
    >
      <Container maxWidth="lg">

        {/* PAGE HEADER */}

        <Box
          sx={{
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Admin Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Manage products, categories,
            orders, customers, and your
            ShopSphere store.
          </Typography>
        </Box>

        {/* ERROR MESSAGE */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        {/* DASHBOARD STATISTICS */}

        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
          }}
        >
          {dashboardCards.map(
            (card) => (
              <Grid
                key={card.title}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Card
                  elevation={2}
                  onClick={() =>
                    navigate(card.path)
                  }
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition:
                      "0.2s ease",
                    "&:hover": {
                      transform:
                        "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>

                    <Box
                      sx={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        {card.title}
                      </Typography>

                      <Box
                        sx={{
                          color:
                            "primary.main",
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Box>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {card.value}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                      }}
                    >
                      {card.description}
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>

        {/* QUICK ACTIONS */}

        <Paper
          elevation={2}
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
            },
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Quick Actions
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
              mb: 3,
            }}
          >
            Manage your ShopSphere
            store from one place.
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            flexWrap="wrap"
          >

            <Button
              variant="contained"
              startIcon={
                <Inventory2OutlinedIcon />
              }
              onClick={() =>
                navigate(
                  "/admin/products"
                )
              }
              sx={{
                py: 1.3,
                px: 3,
                borderRadius: 2,
                textTransform:
                  "none",
              }}
            >
              Manage Products
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <CategoryOutlinedIcon />
              }
              onClick={() =>
                navigate(
                  "/admin/categories"
                )
              }
              sx={{
                py: 1.3,
                px: 3,
                borderRadius: 2,
                textTransform:
                  "none",
              }}
            >
              Manage Categories
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <ShoppingBagOutlinedIcon />
              }
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
              sx={{
                py: 1.3,
                px: 3,
                borderRadius: 2,
                textTransform:
                  "none",
              }}
            >
              Manage Orders
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <PeopleAltOutlinedIcon />
              }
              onClick={() =>
                navigate(
                  "/admin/customers"
                )
              }
              sx={{
                py: 1.3,
                px: 3,
                borderRadius: 2,
                textTransform:
                  "none",
              }}
            >
              Manage Customers
            </Button>

          </Stack>
        </Paper>

      </Container>
    </Box>
  );
}

export default AdminDashboard;