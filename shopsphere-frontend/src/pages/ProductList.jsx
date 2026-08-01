import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

import {
  filterProducts,
} from "../services/productService";


function ProductList() {
  const [searchParams] =
    useSearchParams();

  const searchKeyword =
    searchParams.get("search")?.trim() ||
    "";

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [sort, setSort] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 6;

  // ==========================================
  // GET CORRECT PRODUCT IMAGE URL
  // ==========================================

  const getProductImage = (
    imageUrl
  ) => {
    if (
      !imageUrl ||
      imageUrl.trim() === ""
    ) {
      return iphone16Image;
    }

    if (
      imageUrl.startsWith(
        "http://"
      ) ||
      imageUrl.startsWith(
        "https://"
      )
    ) {
      return imageUrl;
    }

    return `/images/${imageUrl}`;
  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const loadProducts = async (
    customFilters = {}
  ) => {
    try {
      setLoading(true);

      setError("");

      const response =
        await filterProducts({
          keyword:
            customFilters.keyword !==
            undefined
              ? customFilters.keyword
              : searchKeyword,

          categoryId:
            customFilters.categoryId !==
            undefined
              ? customFilters.categoryId
              : categoryId,

          minPrice:
            customFilters.minPrice !==
            undefined
              ? customFilters.minPrice
              : minPrice,

          maxPrice:
            customFilters.maxPrice !==
            undefined
              ? customFilters.maxPrice
              : maxPrice,

          sort:
            customFilters.sort !==
            undefined
              ? customFilters.sort
              : sort,
        });

      setProducts(
        Array.isArray(
          response.data
        )
          ? response.data
          : []
      );

      setCurrentPage(1);
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      setProducts([]);

      setError(
        err.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN SEARCH CHANGES
  // ==========================================

  useEffect(() => {
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");

    loadProducts({
      keyword:
        searchKeyword,

      categoryId:
        "",

      minPrice:
        "",

      maxPrice:
        "",

      sort:
        "",
    });

    // eslint-disable-next-line
    // react-hooks/exhaustive-deps
  }, [searchKeyword]);

  // ==========================================
  // APPLY FILTERS
  // ==========================================

  const handleApplyFilters = () => {
    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(minPrice) >
        Number(maxPrice)
    ) {
      setError(
        "Minimum price cannot be greater than maximum price."
      );

      return;
    }

    loadProducts();
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const handleClearFilters = () => {
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setError("");

    loadProducts({
      keyword:
        searchKeyword,

      categoryId:
        "",

      minPrice:
        "",

      maxPrice:
        "",

      sort:
        "",
    });
  };

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        products.length /
          productsPerPage
      )
    );

  const lastProductIndex =
    currentPage *
    productsPerPage;

  const firstProductIndex =
    lastProductIndex -
    productsPerPage;

  const displayedProducts =
    products.slice(
      firstProductIndex,
      lastProductIndex
    );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight:
            "65vh",

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

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        minHeight:
          "100vh",

        backgroundColor:
          "#f5f7fb",

        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Container
        maxWidth="lg"
      >
        {/* PAGE TITLE */}

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          {searchKeyword
            ? "Search Results"
            : "All Products"}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            mb: 4,
          }}
        >
          {searchKeyword
            ? `Showing results for "${searchKeyword}"`
            : "Explore our complete product collection"}
        </Typography>

        {/* FILTER SECTION */}

        <Paper
          elevation={1}
          sx={{
            p: {
              xs: 2,
              md: 3,
            },

            borderRadius:
              3,

            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mb: 2.5,

              display:
                "flex",

              alignItems:
                "center",

              gap: 1,
            }}
          >
            <FilterAltOutlinedIcon />

            Filter Products
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {/* CATEGORY */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <FormControl
                fullWidth
              >
                <InputLabel>
                  Category
                </InputLabel>

                <Select
                  value={
                    categoryId
                  }

                  label="Category"

                  onChange={(
                    event
                  ) =>
                    setCategoryId(
                      event.target
                        .value
                    )
                  }
                >
                  <MenuItem
                    value=""
                  >
                    All Categories
                  </MenuItem>

                  <MenuItem
                    value={1}
                  >
                    Electronics
                  </MenuItem>

                  <MenuItem
                    value={2}
                  >
                    Fashion
                  </MenuItem>

                  <MenuItem
                    value={3}
                  >
                    Home & Kitchen
                  </MenuItem>

                  <MenuItem
                    value={4}
                  >
                    Books
                  </MenuItem>

                  <MenuItem
                    value={5}
                  >
                    Beauty & Personal Care
                  </MenuItem>

                  <MenuItem
                    value={6}
                  >
                    Sports & Fitness
                  </MenuItem>

                  <MenuItem
                    value={7}
                  >
                    Gaming
                  </MenuItem>

                  <MenuItem
                    value={8}
                  >
                    Grocery & Essentials
                  </MenuItem>

                  <MenuItem
                    value={9}
                  >
                    Toys & Games
                  </MenuItem>

                  <MenuItem
                    value={10}
                  >
                    Office & Stationery
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* MINIMUM PRICE */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <TextField
                fullWidth

                type="number"

                label="Minimum Price"

                value={
                  minPrice
                }

                onChange={(
                  event
                ) =>
                  setMinPrice(
                    event.target
                      .value
                  )
                }

                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/* MAXIMUM PRICE */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <TextField
                fullWidth

                type="number"

                label="Maximum Price"

                value={
                  maxPrice
                }

                onChange={(
                  event
                ) =>
                  setMaxPrice(
                    event.target
                      .value
                  )
                }

                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/* SORT */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <FormControl
                fullWidth
              >
                <InputLabel>
                  Sort By
                </InputLabel>

                <Select
                  value={
                    sort
                  }

                  label="Sort By"

                  onChange={(
                    event
                  ) =>
                    setSort(
                      event.target
                        .value
                    )
                  }
                >
                  <MenuItem
                    value=""
                  >
                    Default
                  </MenuItem>

                  <MenuItem
                    value="latest"
                  >
                    Latest
                  </MenuItem>

                  <MenuItem
                    value="priceAsc"
                  >
                    Price: Low to High
                  </MenuItem>

                  <MenuItem
                    value="priceDesc"
                  >
                    Price: High to Low
                  </MenuItem>

                  <MenuItem
                    value="nameAsc"
                  >
                    Name: A to Z
                  </MenuItem>

                  <MenuItem
                    value="nameDesc"
                  >
                    Name: Z to A
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* BUTTONS */}

            <Grid
              size={{
                xs: 12,
              }}
            >
              <Box
                sx={{
                  display:
                    "flex",

                  gap: 2,

                  flexWrap:
                    "wrap",
                }}
              >
                <Button
                  variant="contained"

                  onClick={
                    handleApplyFilters
                  }

                  startIcon={
                    <FilterAltOutlinedIcon />
                  }
                >
                  Apply Filters
                </Button>

                <Button
                  variant="outlined"

                  onClick={
                    handleClearFilters
                  }

                  startIcon={
                    <RestartAltOutlinedIcon />
                  }
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
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

        {/* PRODUCT COUNT */}

        {!error && (
          <Typography
            color="text.secondary"

            sx={{
              mb: 2.5,
            }}
          >
            {products.length}{" "}
            product
            {products.length !==
            1
              ? "s"
              : ""}{" "}
            found
          </Typography>
        )}

        {/* EMPTY RESULT */}

        {!error &&
          products.length ===
            0 && (
            <Paper
              elevation={0}

              sx={{
                minHeight:
                  "300px",

                display:
                  "flex",

                flexDirection:
                  "column",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                textAlign:
                  "center",

                p: 3,

                borderRadius:
                  3,
              }}
            >
              <Typography
                variant="h5"

                fontWeight="bold"
              >
                No products found
              </Typography>

              <Typography
                color="text.secondary"

                sx={{
                  mt: 1,
                  mb: 3,
                }}
              >
                Try changing or
                clearing your
                filters.
              </Typography>

              <Button
                variant="contained"

                onClick={
                  handleClearFilters
                }
              >
                Clear Filters
              </Button>
            </Paper>
          )}

        {/* PRODUCT GRID */}

        {!error &&
          displayedProducts.length >
            0 && (
            <>
              <Grid
                container

                spacing={3}
              >
                {displayedProducts.map(
                  (
                    product
                  ) => (
                    <Grid
                      key={
                        product.id
                      }

                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <Card
                        sx={{
                          height:
                            "100%",

                          borderRadius:
                            3,

                          transition:
                            "0.25s",

                          "&:hover":
                            {
                              transform:
                                "translateY(-5px)",

                              boxShadow:
                                7,
                            },
                        }}
                      >
                        <CardActionArea
                          component={
                            Link
                          }

                          to={`/products/${product.id}`}

                          sx={{
                            height:
                              "100%",
                          }}
                        >
                          <CardMedia
                            component="img"

                            height="240"

                            image={
                              getProductImage(
                                product.imageUrl
                              )
                            }

                            alt={
                              product.name
                            }

                            onError={(
                              event
                            ) => {
                              event.currentTarget.src =
                                iphone16Image;
                            }}

                            sx={{
                              objectFit:
                                "contain",

                              p: 2,

                              backgroundColor:
                                "#f8f8f8",
                            }}
                          />

                          <CardContent>
                            <Typography
                              variant="caption"

                              color="primary"

                              fontWeight="bold"
                            >
                              {
                                product.categoryName
                              }
                            </Typography>

                            <Typography
                              variant="h6"

                              fontWeight="bold"

                              sx={{
                                mt: 1,
                              }}
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

                                minHeight:
                                  40,
                              }}
                            >
                              {
                                product.description
                              }
                            </Typography>

                            <Divider
                              sx={{
                                my: 2,
                              }}
                            />

                            <Typography
                              variant="h6"

                              color="primary"

                              fontWeight="bold"
                            >
                              ₹
                              {Number(
                                product.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </Typography>

                            <Typography
                              variant="body2"

                              color={
                                product.stock >
                                0
                                  ? "success.main"
                                  : "error.main"
                              }

                              sx={{
                                mt: 1,
                              }}
                            >
                              {product.stock >
                              0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>

              {/* PAGINATION */}

              {totalPages >
                1 && (
                <Box
                  sx={{
                    display:
                      "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    gap: 2,

                    mt: 5,
                  }}
                >
                  <Button
                    variant="outlined"

                    disabled={
                      currentPage ===
                      1
                    }

                    onClick={() =>
                      setCurrentPage(
                        (
                          previousPage
                        ) =>
                          previousPage -
                          1
                      )
                    }
                  >
                    Previous
                  </Button>

                  <Typography
                    fontWeight="bold"
                  >
                    Page{" "}
                    {
                      currentPage
                    }{" "}
                    of{" "}
                    {
                      totalPages
                    }
                  </Typography>

                  <Button
                    variant="outlined"

                    disabled={
                      currentPage ===
                      totalPages
                    }

                    onClick={() =>
                      setCurrentPage(
                        (
                          previousPage
                        ) =>
                          previousPage +
                          1
                      )
                    }
                  >
                    Next
                  </Button>
                </Box>
              )}
            </>
          )}
      </Container>
    </Box>
  );
}

export default ProductList;