import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAllProducts,
} from "../services/productService";

function SmartRecommendations() {
  const navigate =
    useNavigate();

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations =
    async () => {
      try {
        setLoading(true);

        setError("");

        const response =
          await getAllProducts();

        const allProducts =
          Array.isArray(
            response.data
          )
            ? response.data
            : [];

        const recommendedProducts =
          [...allProducts]

            .filter(
              (product) =>
                Number(
                  product.stock
                ) > 0
            )

            .sort(
              (
                firstProduct,
                secondProduct
              ) =>
                Number(
                  secondProduct.stock
                )
                -
                Number(
                  firstProduct.stock
                )
            )

            .slice(
              0,
              12
            );

        setProducts(
          recommendedProducts
        );
      } catch (error) {
        console.error(
          "Unable to load recommendations:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
          "Unable to load smart product recommendations."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight:
            "70vh",

          display:
            "flex",

          justifyContent:
            "center",

          alignItems:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight:
          "100vh",

        py: {
          xs: 3,
          md: 5,
        },

        backgroundColor:
          "#f5f7fb",
      }}
    >
      <Container
        maxWidth="xl"
      >
        {/* HEADER */}

        <Paper
          elevation={2}

          sx={{
            p: {
              xs: 3,
              md: 4,
            },

            mb: 4,

            borderRadius:
              4,

            textAlign:
              "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Smart Product
            Recommendations
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Discover available
            ShopSphere products
            selected using stock,
            availability, and
            product data.
          </Typography>

          <Button
            variant="outlined"

            onClick={
              loadRecommendations
            }

            sx={{
              mt: 2,

              textTransform:
                "none",
            }}
          >
            Refresh Recommendations
          </Button>
        </Paper>

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

        {/* EMPTY */}

        {!error &&
          products.length === 0 && (
            <Paper
              elevation={2}

              sx={{
                p: 6,

                borderRadius:
                  4,

                textAlign:
                  "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                No recommendations
                available
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                Add products with
                available stock to
                see recommendations.
              </Typography>
            </Paper>
          )}

        {/* PRODUCT GRID */}

        <Grid
          container
          spacing={3}
        >
          {products.map(
            (product) => (
              <Grid
                key={
                  product.id
                }

                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <Card
                  elevation={2}

                  sx={{
                    height:
                      "100%",

                    display:
                      "flex",

                    flexDirection:
                      "column",

                    borderRadius:
                      3,

                    overflow:
                      "hidden",
                  }}
                >
                  <CardMedia
                    component="img"

                    height="210"

                    image={
                      product.imageUrl ||
                      "https://placehold.co/600x400?text=ShopSphere"
                    }

                    alt={
                      product.name
                    }

                    onError={
                      (event) => {
                        event.currentTarget.src =
                          "https://placehold.co/600x400?text=ShopSphere";
                      }
                    }
                  />

                  <CardContent
                    sx={{
                      flexGrow: 1,

                      display:
                        "flex",

                      flexDirection:
                        "column",
                    }}
                  >
                    <Chip
                      label={
                        product.categoryName ||
                        "Product"
                      }

                      size="small"

                      sx={{
                        alignSelf:
                          "flex-start",

                        mb: 1.5,
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      {
                        product.name
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"

                      sx={{
                        mt: 1,

                        display:
                          "-webkit-box",

                        WebkitLineClamp:
                          2,

                        WebkitBoxOrient:
                          "vertical",

                        overflow:
                          "hidden",
                      }}
                    >
                      {
                        product.description
                      }
                    </Typography>

                    <Box
                      sx={{
                        mt: "auto",

                        pt: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                      >
                        ₹
                        {
                          Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="success.main"

                        fontWeight="medium"

                        sx={{
                          mt: 0.5,
                        }}
                      >
                        In stock:
                        {" "}
                        {
                          product.stock
                        }
                      </Typography>

                      <Button
                        fullWidth

                        variant="contained"

                        onClick={() =>
                          navigate(
                            `/products/${product.id}`
                          )
                        }

                        sx={{
                          mt: 2,

                          textTransform:
                            "none",
                        }}
                      >
                        View Product
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default SmartRecommendations;