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
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ShoppingBagOutlinedIcon
  from "@mui/icons-material/ShoppingBagOutlined";

import LocalShippingOutlinedIcon
  from "@mui/icons-material/LocalShippingOutlined";

import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";

import SupportAgentOutlinedIcon
  from "@mui/icons-material/SupportAgentOutlined";

import SmartToyOutlinedIcon
  from "@mui/icons-material/SmartToyOutlined";

import RecommendOutlinedIcon
  from "@mui/icons-material/RecommendOutlined";

import TrackChangesOutlinedIcon
  from "@mui/icons-material/TrackChangesOutlined";

import ArrowForwardIcon
  from "@mui/icons-material/ArrowForward";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAllProducts,
  getLatestProducts,
} from "../services/productService";

function Home() {
  const navigate =
    useNavigate();

  const [
    featuredProducts,
    setFeaturedProducts,
  ] = useState([]);

  const [
    latestProducts,
    setLatestProducts,
  ] = useState([]);

  const [
    dealProducts,
    setDealProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const features = [
    {
      title:
        "Quality Products",

      description:
        "Explore carefully selected products across different categories.",

      icon:
        <ShoppingBagOutlinedIcon />,
    },

    {
      title:
        "Fast Delivery",

      description:
        "Get your orders delivered quickly and conveniently.",

      icon:
        <LocalShippingOutlinedIcon />,
    },

    {
      title:
        "Secure Shopping",

      description:
        "Your account and order information are protected.",

      icon:
        <SecurityOutlinedIcon />,
    },

    {
      title:
        "Customer Support",

      description:
        "Get help whenever you need it during your shopping journey.",

      icon:
        <SupportAgentOutlinedIcon />,
    },
  ];

  useEffect(() => {
    loadHomeProducts();
  }, []);

  const loadHomeProducts =
    async () => {
      try {
        setLoading(true);

        setError("");

        const [
          allProductsResponse,
          latestProductsResponse,
        ] = await Promise.all([
          getAllProducts(),

          getLatestProducts(),
        ]);

        const allProducts =
          Array.isArray(
            allProductsResponse.data
          )
            ? allProductsResponse.data
            : [];

        const latest =
          Array.isArray(
            latestProductsResponse.data
          )
            ? latestProductsResponse.data
            : [];

        const availableProducts =
          allProducts.filter(
            (product) =>
              Number(
                product.stock
              ) > 0
          );

        setFeaturedProducts(
          availableProducts.slice(
            0,
            4
          )
        );

        setLatestProducts(
          latest.slice(
            0,
            4
          )
        );

        setDealProducts(
          [...availableProducts]
            .sort(
              (
                firstProduct,
                secondProduct
              ) =>
                Number(
                  firstProduct.price
                ) -
                Number(
                  secondProduct.price
                )
            )
            .slice(
              0,
              4
            )
        );
      } catch (error) {
        console.error(
          "Unable to load home products:",
          error
        );

        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  const getProductId =
    (product) => {
      return (
        product.id ??
        product.productId
      );
    };

  const openProduct =
    (product) => {
      const productId =
        getProductId(
          product
        );

      if (
        productId ===
          undefined ||
        productId ===
          null
      ) {
        console.error(
          "Product ID is missing:",
          product
        );

        return;
      }

      navigate(
        `/products/${productId}`
      );
    };

  const ProductCard = ({
    product,
  }) => (
    <Card
      elevation={0}
      sx={{
        height:
          "100%",

        display:
          "flex",

        flexDirection:
          "column",

        border:
          "1px solid #E5E7EB",

        borderRadius:
          4,

        overflow:
          "hidden",

        transition:
          "0.25s ease",

        "&:hover": {
          transform:
            "translateY(-6px)",

          boxShadow:
            6,
        },
      }}
    >
      <CardMedia
        component="img"

        height="220"

        image={
          product.imageUrl ||
          "https://placehold.co/600x400?text=ShopSphere"
        }

        alt={
          product.name ||
          "ShopSphere Product"
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
          p: 2.5,

          flexGrow:
            1,

          display:
            "flex",

          flexDirection:
            "column",
        }}
      >
        <Typography
          variant="body2"

          color="primary"

          fontWeight={700}
        >
          {
            product.categoryName ||
            "ShopSphere"
          }
        </Typography>

        <Typography
          variant="h6"

          fontWeight={700}

          sx={{
            mt: 0.7,
          }}
        >
          {
            product.name ||
            "Product"
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
            product.description ||
            "Explore this product on ShopSphere."
          }
        </Typography>

        <Box
          sx={{
            mt:
              "auto",

            pt:
              2,
          }}
        >
          <Typography
            variant="h6"

            fontWeight={800}
          >
            ₹
            {
              Number(
                product.price || 0
              ).toLocaleString(
                "en-IN"
              )
            }
          </Typography>

          <Typography
            variant="body2"

            color={
              Number(
                product.stock
              ) > 0
                ? "success.main"
                : "error.main"
            }

            sx={{
              mt:
                0.5,
            }}
          >
            {
              Number(
                product.stock
              ) > 0
                ? `In stock: ${product.stock}`
                : "Out of stock"
            }
          </Typography>

          <Button
            fullWidth

            variant="contained"

            onClick={() =>
              openProduct(
                product
              )
            }

            endIcon={
              <ArrowForwardIcon />
            }

            sx={{
              mt:
                2,

              textTransform:
                "none",

              borderRadius:
                2,
            }}
          >
            View Product
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const ProductSection = ({
    title,
    description,
    products,
    backgroundColor =
      "transparent",
  }) => (
    <Box
      sx={{
        backgroundColor,

        py: {
          xs:
            6,

          md:
            9,
        },
      }}
    >
      <Container
        maxWidth="lg"
      >
        <Box
          sx={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            flexWrap:
              "wrap",

            gap:
              2,

            mb:
              4,
          }}
        >
          <Box>
            <Typography
              variant="h3"

              fontWeight={800}
            >
              {title}
            </Typography>

            <Typography
              color="text.secondary"

              sx={{
                mt:
                  1,
              }}
            >
              {description}
            </Typography>
          </Box>

          <Button
            onClick={() =>
              navigate(
                "/products"
              )
            }

            endIcon={
              <ArrowForwardIcon />
            }

            sx={{
              textTransform:
                "none",
            }}
          >
            View All
          </Button>
        </Box>

        <Grid
          container

          spacing={3}
        >
          {products.map(
            (
              product,
              index
            ) => (
              <Grid
                key={
                  getProductId(
                    product
                  ) ?? index
                }

                size={{
                  xs:
                    12,

                  sm:
                    6,

                  md:
                    3,
                }}
              >
                <ProductCard
                  product={
                    product
                  }
                />
              </Grid>
            )
          )}
        </Grid>
      </Container>
    </Box>
  );

  return (
    <Box>

      {/* HERO SECTION */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 50%, #FFF7ED 100%)",

          minHeight: {
            xs:
              "auto",

            md:
              "560px",
          },

          display:
            "flex",

          alignItems:
            "center",

          py: {
            xs:
              8,

            md:
              0,
          },
        }}
      >
        <Container
          maxWidth="lg"
        >
          <Grid
            container

            spacing={6}

            sx={{
              alignItems:
                "center",
            }}
          >
            <Grid
              size={{
                xs:
                  12,

                md:
                  7,
              }}
            >
              <Stack
                spacing={3}
              >
                <Typography
                  variant="overline"

                  color="primary"

                  fontWeight={700}

                  letterSpacing={2}
                >
                  SMART SHOPPING
                  MADE SIMPLE
                </Typography>

                <Typography
                  variant="h2"

                  fontWeight={800}

                  sx={{
                    fontSize: {
                      xs:
                        "2.7rem",

                      sm:
                        "3.6rem",

                      md:
                        "4.5rem",
                    },

                    lineHeight:
                      1.05,
                  }}
                >
                  Find What You Love.

                  <Box
                    component="span"

                    sx={{
                      display:
                        "block",

                      color:
                        "primary.main",
                    }}
                  >
                    Shop With
                    Confidence.
                  </Box>
                </Typography>

                <Typography
                  variant="h6"

                  color="text.secondary"

                  sx={{
                    maxWidth:
                      650,

                    lineHeight:
                      1.7,

                    fontWeight:
                      400,
                  }}
                >
                  Discover great
                  products, save your
                  favourites, manage
                  your cart, and place
                  orders through one
                  simple shopping
                  experience.
                </Typography>

                <Stack
                  direction={{
                    xs:
                      "column",

                    sm:
                      "row",
                  }}

                  spacing={2}
                >
                  <Button
                    variant="contained"

                    size="large"

                    onClick={() =>
                      navigate(
                        "/products"
                      )
                    }

                    sx={{
                      px:
                        4,

                      py:
                        1.5,

                      borderRadius:
                        2,

                      textTransform:
                        "none",
                    }}
                  >
                    Shop Now
                  </Button>

                  <Button
                    variant="outlined"

                    size="large"

                    onClick={() =>
                      navigate(
                        "/recommendations"
                      )
                    }

                    sx={{
                      px:
                        4,

                      py:
                        1.5,

                      borderRadius:
                        2,

                      textTransform:
                        "none",
                    }}
                  >
                    Smart Picks
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid
              size={{
                xs:
                  12,

                md:
                  5,
              }}
            >
              <Box
                sx={{
                  width:
                    "100%",

                  minHeight: {
                    xs:
                      300,

                    md:
                      420,
                  },

                  borderRadius:
                    6,

                  display:
                    "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  background:
                    "linear-gradient(145deg, #4F46E5, #7C3AED)",

                  boxShadow:
                    "0 25px 60px rgba(79, 70, 229, 0.28)",
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize: {
                      xs:
                        150,

                      md:
                        220,
                    },

                    color:
                      "white",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ERROR */}

      {error && (
        <Container
          maxWidth="lg"
        >
          <Alert
            severity="error"

            sx={{
              mt:
                3,
            }}
          >
            {error}
          </Alert>
        </Container>
      )}

      {/* PRODUCT SECTIONS */}

      {loading ? (
        <Box
          sx={{
            minHeight:
              "45vh",

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
      ) : (
        <>
          <ProductSection
            title={
              "Featured Products"
            }

            description={
              "Popular products selected for your shopping experience."
            }

            products={
              featuredProducts
            }
          />

          <ProductSection
            title={
              "Latest Products"
            }

            description={
              "Explore the newest products added to ShopSphere."
            }

            products={
              latestProducts
            }

            backgroundColor={
              "#F8FAFC"
            }
          />

          <ProductSection
            title={
              "Today's Deals"
            }

            description={
              "Discover great products at attractive prices."
            }

            products={
              dealProducts
            }
          />
        </>
      )}

      {/* SHOP SMARTER */}

      <Box
        sx={{
          backgroundColor:
            "#F1F5F9",

          py: {
            xs:
              7,

            md:
              10,
          },
        }}
      >
        <Container
          maxWidth="lg"
        >
          <Box
            sx={{
              textAlign:
                "center",

              mb:
                6,
            }}
          >
            <Typography
              variant="h3"

              fontWeight={800}
            >
              Shop Smarter With
              ShopSphere
            </Typography>

            <Typography
              color="text.secondary"

              sx={{
                mt:
                  1.5,
              }}
            >
              Explore intelligent
              tools designed to make
              shopping easier.
            </Typography>
          </Box>

          <Grid
            container

            spacing={3}
          >

            {/* AI ASSISTANT */}

            <Grid
              size={{
                xs:
                  12,

                sm:
                  6,

                md:
                  3,
              }}
            >
              <Card
                sx={{
                  height:
                    "100%",

                  borderRadius:
                    4,
                }}
              >
                <CardContent
                  sx={{
                    p:
                      3,
                  }}
                >
                  <SmartToyOutlinedIcon
                    color="primary"

                    sx={{
                      fontSize:
                        50,
                    }}
                  />

                  <Typography
                    variant="h6"

                    fontWeight={700}

                    sx={{
                      mt:
                        2,
                    }}
                  >
                    AI Shopping
                    Assistant
                  </Typography>

                  <Typography
                    variant="body2"

                    color="text.secondary"

                    sx={{
                      mt:
                        1,

                      lineHeight:
                        1.7,
                    }}
                  >
                    Ask about
                    products, stock,
                    recommendations,
                    and orders.
                  </Typography>

                  <Button
                    fullWidth

                    variant="contained"

                    onClick={() =>
                      navigate(
                        "/ai-assistant"
                      )
                    }

                    sx={{
                      mt:
                        3,

                      textTransform:
                        "none",
                    }}
                  >
                    Chat With AI
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* RECOMMENDATIONS */}

            <Grid
              size={{
                xs:
                  12,

                sm:
                  6,

                md:
                  3,
              }}
            >
              <Card
                sx={{
                  height:
                    "100%",

                  borderRadius:
                    4,
                }}
              >
                <CardContent
                  sx={{
                    p:
                      3,
                  }}
                >
                  <RecommendOutlinedIcon
                    color="primary"

                    sx={{
                      fontSize:
                        50,
                    }}
                  />

                  <Typography
                    variant="h6"

                    fontWeight={700}

                    sx={{
                      mt:
                        2,
                    }}
                  >
                    Smart
                    Recommendations
                  </Typography>

                  <Typography
                    variant="body2"

                    color="text.secondary"

                    sx={{
                      mt:
                        1,

                      lineHeight:
                        1.7,
                    }}
                  >
                    Discover products
                    selected using
                    availability and
                    product data.
                  </Typography>

                  <Button
                    fullWidth

                    variant="outlined"

                    onClick={() =>
                      navigate(
                        "/recommendations"
                      )
                    }

                    sx={{
                      mt:
                        3,

                      textTransform:
                        "none",
                    }}
                  >
                    View Smart Picks
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* ORDER TRACKING */}

            <Grid
              size={{
                xs:
                  12,

                sm:
                  6,

                md:
                  3,
              }}
            >
              <Card
                sx={{
                  height:
                    "100%",

                  borderRadius:
                    4,
                }}
              >
                <CardContent
                  sx={{
                    p:
                      3,
                  }}
                >
                  <TrackChangesOutlinedIcon
                    color="primary"

                    sx={{
                      fontSize:
                        50,
                    }}
                  />

                  <Typography
                    variant="h6"

                    fontWeight={700}

                    sx={{
                      mt:
                        2,
                    }}
                  >
                    Track Your
                    Orders
                  </Typography>

                  <Typography
                    variant="body2"

                    color="text.secondary"

                    sx={{
                      mt:
                        1,

                      lineHeight:
                        1.7,
                    }}
                  >
                    Follow your order
                    from placement to
                    delivery.
                  </Typography>

                  <Button
                    fullWidth

                    variant="outlined"

                    onClick={() =>
                      navigate(
                        "/order-tracking"
                      )
                    }

                    sx={{
                      mt:
                        3,

                      textTransform:
                        "none",
                    }}
                  >
                    Track Orders
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* HELP AND SUPPORT */}

            <Grid
              size={{
                xs:
                  12,

                sm:
                  6,

                md:
                  3,
              }}
            >
              <Card
                sx={{
                  height:
                    "100%",

                  borderRadius:
                    4,
                }}
              >
                <CardContent
                  sx={{
                    p:
                      3,
                  }}
                >
                  <SupportAgentOutlinedIcon
                    color="primary"

                    sx={{
                      fontSize:
                        50,
                    }}
                  />

                  <Typography
                    variant="h6"

                    fontWeight={700}

                    sx={{
                      mt:
                        2,
                    }}
                  >
                    Help &
                    Support
                  </Typography>

                  <Typography
                    variant="body2"

                    color="text.secondary"

                    sx={{
                      mt:
                        1,

                      lineHeight:
                        1.7,
                    }}
                  >
                    Find answers to
                    common questions
                    or contact support.
                  </Typography>

                  <Button
                    fullWidth

                    variant="outlined"

                    onClick={() =>
                      navigate(
                        "/help-support"
                      )
                    }

                    sx={{
                      mt:
                        3,

                      textTransform:
                        "none",
                    }}
                  >
                    Get Help
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* WHY SHOP WITH US */}

      <Container
        maxWidth="lg"

        sx={{
          py: {
            xs:
              7,

            md:
              10,
          },
        }}
      >
        <Box
          sx={{
            textAlign:
              "center",

            mb:
              6,
          }}
        >
          <Typography
            variant="h3"

            fontWeight={800}
          >
            Why Shop With Us?
          </Typography>

          <Typography
            color="text.secondary"

            sx={{
              mt:
                1.5,
            }}
          >
            Everything you need
            for a smooth and
            reliable shopping
            experience.
          </Typography>
        </Box>

        <Grid
          container

          spacing={3}
        >
          {features.map(
            (
              feature
            ) => (
              <Grid
                key={
                  feature.title
                }

                size={{
                  xs:
                    12,

                  sm:
                    6,

                  md:
                    3,
                }}
              >
                <Card
                  elevation={0}

                  sx={{
                    height:
                      "100%",

                    border:
                      "1px solid #E5E7EB",

                    borderRadius:
                      4,
                  }}
                >
                  <CardContent
                    sx={{
                      p:
                        3,
                    }}
                  >
                    <Box
                      sx={{
                        width:
                          58,

                        height:
                          58,

                        borderRadius:
                          3,

                        display:
                          "flex",

                        justifyContent:
                          "center",

                        alignItems:
                          "center",

                        backgroundColor:
                          "primary.light",

                        color:
                          "primary.main",

                        mb:
                          2.5,
                      }}
                    >
                      {
                        feature.icon
                      }
                    </Box>

                    <Typography
                      variant="h6"

                      fontWeight={700}
                    >
                      {
                        feature.title
                      }
                    </Typography>

                    <Typography
                      variant="body2"

                      color="text.secondary"

                      sx={{
                        mt:
                          1,

                        lineHeight:
                          1.7,
                      }}
                    >
                      {
                        feature.description
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Container>

      {/* BOTTOM CTA */}

      <Box
        sx={{
          backgroundColor:
            "#111827",

          color:
            "white",

          py: {
            xs:
              7,

            md:
              9,
          },
        }}
      >
        <Container
          maxWidth="md"
        >
          <Stack
            spacing={3}

            sx={{
              alignItems:
                "center",

              textAlign:
                "center",
            }}
          >
            <Typography
              variant="h3"

              fontWeight={800}
            >
              Ready to Start
              Shopping?
            </Typography>

            <Typography
              sx={{
                color:
                  "#D1D5DB",

                maxWidth:
                  600,
              }}
            >
              Browse our products
              and enjoy a simple,
              modern shopping
              experience with
              ShopSphere.
            </Typography>

            <Button
              variant="contained"

              size="large"

              onClick={() =>
                navigate(
                  "/products"
                )
              }

              sx={{
                px:
                  4,

                py:
                  1.5,

                borderRadius:
                  2,

                textTransform:
                  "none",
              }}
            >
              Explore Products
            </Button>
          </Stack>
        </Container>
      </Box>

    </Box>
  );
}

export default Home;