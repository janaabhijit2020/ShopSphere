import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  addProductStock,
  getAllProducts,
} from "../../services/productService";

function AdminProducts() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingProductId,
    setUpdatingProductId] =
    useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      setError("");

      const response =
        await getAllProducts();

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE STOCK
  // ==========================================

  const handleStockChange =
    async (
      productId,
      quantity
    ) => {
      try {
        setUpdatingProductId(
          productId
        );

        setError("");

        const response =
          await addProductStock(
            productId,
            quantity
          );

        setProducts(
          (previousProducts) =>
            previousProducts.map(
              (product) =>
                product.id === productId
                  ? {
                      ...product,

                      stock:
                        response.data.stock,
                    }
                  : product
            )
        );
      } catch (error) {
        console.error(
          "Failed to update stock:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to update stock."
        );
      } finally {
        setUpdatingProductId(
          null
        );
      }
    };

  // ==========================================
  // LOADING
  // ==========================================

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

  // ==========================================
  // UI
  // ==========================================

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
      <Container maxWidth="xl">

        {/* PAGE HEADER */}

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: {
              xs: "flex-start",
              sm: "center",
            },

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            gap: 2,

            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Manage Products
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              View products and manage
              available stock.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            sx={{
              textTransform:
                "none",
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* ERROR */}

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

        {/* PRODUCT TABLE */}

        {!error && (
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,

              overflow:
                "hidden",
            }}
          >
            <TableContainer>

              <Table>

                <TableHead>

                  <TableRow>

                    <TableCell>
                      <Typography
                        fontWeight="bold"
                      >
                        ID
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight="bold"
                      >
                        Product
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight="bold"
                      >
                        Category
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight="bold"
                      >
                        Price
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight="bold"
                      >
                        Stock
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight="bold"
                      >
                        Actions
                      </Typography>
                    </TableCell>

                  </TableRow>

                </TableHead>

                <TableBody>

                  {products.map(
                    (product) => {

                      const isUpdating =

                        updatingProductId
                        ===
                        product.id;

                      return (

                        <TableRow
                          key={
                            product.id
                          }
                          hover
                        >

                          <TableCell>
                            {
                              product.id
                            }
                          </TableCell>

                          <TableCell>

                            <Typography
                              fontWeight="bold"
                            >
                              {
                                product.name
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {
                                product.description
                              }
                            </Typography>

                          </TableCell>

                          <TableCell>

                            {
                              product.categoryName
                            }

                          </TableCell>

                          <TableCell>

                            ₹

                            {
                              Number(
                                product.price
                              ).toLocaleString(
                                "en-IN"
                              )
                            }

                          </TableCell>

                          {/* STOCK CONTROLS */}

                          <TableCell>

                            <Box
                              sx={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap: 0.5,
                              }}
                            >

                              {/* MINUS */}

                              <Tooltip
                                title={
                                  product.stock <= 0
                                    ? "Stock cannot be negative"
                                    : "Decrease stock by 1"
                                }
                              >

                                <span>

                                  <IconButton

                                    size="small"

                                    color="error"

                                    disabled={

                                      isUpdating

                                      ||

                                      product.stock
                                      <= 0

                                    }

                                    onClick={() =>

                                      handleStockChange(

                                        product.id,

                                        -1

                                      )

                                    }
                                  >

                                    <RemoveIcon />

                                  </IconButton>

                                </span>

                              </Tooltip>


                              {/* STOCK NUMBER */}

                              <Box
                                sx={{
                                  minWidth:
                                    42,

                                  textAlign:
                                    "center",
                                }}
                              >

                                {isUpdating ? (

                                  <CircularProgress
                                    size={20}
                                  />

                                ) : (

                                  <Typography

                                    fontWeight="bold"

                                    color={

                                      product.stock
                                      > 0

                                        ? "success.main"

                                        : "error.main"

                                    }
                                  >

                                    {
                                      product.stock
                                    }

                                  </Typography>

                                )}

                              </Box>


                              {/* PLUS */}

                              <Tooltip
                                title={
                                  "Increase stock by 1"
                                }
                              >

                                <span>

                                  <IconButton

                                    size="small"

                                    color="primary"

                                    disabled={
                                      isUpdating
                                    }

                                    onClick={() =>

                                      handleStockChange(

                                        product.id,

                                        1

                                      )

                                    }
                                  >

                                    <AddIcon />

                                  </IconButton>

                                </span>

                              </Tooltip>

                            </Box>

                          </TableCell>

                          {/* ACTIONS */}

                          <TableCell>

                            <Button
                              size="small"
                              sx={{
                                textTransform:
                                  "none",
                              }}
                            >
                              Edit
                            </Button>

                            <Button
                              size="small"
                              color="error"
                              sx={{
                                textTransform:
                                  "none",
                              }}
                            >
                              Delete
                            </Button>

                          </TableCell>

                        </TableRow>

                      );
                    }
                  )}

                  {products.length === 0 && (

                    <TableRow>

                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{
                          py: 5,
                        }}
                      >
                        No products found.
                      </TableCell>

                    </TableRow>

                  )}

                </TableBody>

              </Table>

            </TableContainer>
          </Paper>
        )}

      </Container>
    </Box>
  );
}

export default AdminProducts;