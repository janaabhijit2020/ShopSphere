import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { getProductById } from "../services/productService";

import {
  addToCart,
  getCart,
} from "../services/cartService";

import {
  addToWishlist,
  getMyWishlist,
} from "../services/wishlistService";

import {
  addReview,
  deleteReview,
  getReviewsByProduct,
  updateReview,
} from "../services/reviewService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [
    addingToWishlist,
    setAddingToWishlist,
  ] = useState(false);

  const [isInCart, setIsInCart] =
    useState(false);

  const [
    isInWishlist,
    setIsInWishlist,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [
    messageType,
    setMessageType,
  ] = useState("success");

  // ================= REVIEWS =================

  const [reviews, setReviews] =
    useState([]);

  const [
    reviewsLoading,
    setReviewsLoading,
  ] = useState(true);

  const [
    reviewRating,
    setReviewRating,
  ] = useState(5);

  const [
    reviewComment,
    setReviewComment,
  ] = useState("");

  const [
    submittingReview,
    setSubmittingReview,
  ] = useState(false);

  const [
    editingReviewId,
    setEditingReviewId,
  ] = useState(null);

  const [
    deletingReviewId,
    setDeletingReviewId,
  ] = useState(null);

  const token =
    localStorage.getItem("token");

  // ================= LOAD REVIEWS =================

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);

      const response =
        await getReviewsByProduct(id);

      setReviews(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (reviewError) {
      console.error(
        "Unable to load reviews:",
        reviewError
      );

      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // ================= LOAD PRODUCT =================

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError("");

        const productResponse =
          await getProductById(id);

        setProduct(
          productResponse.data
        );

        setQuantity(1);

        // Load wishlist

        try {
          const wishlistResponse =
            await getMyWishlist();

          const wishlistItems =
            Array.isArray(
              wishlistResponse.data
            )
              ? wishlistResponse.data
              : [];

          const productExists =
            wishlistItems.some(
              (item) =>
                String(
                  item.productId
                ) === String(id)
            );

          setIsInWishlist(
            productExists
          );
        } catch (wishlistError) {
          console.error(
            "Unable to load wishlist:",
            wishlistError
          );
        }

        // Load cart

        try {
          const cartResponse =
            await getCart();

          const cartData =
            cartResponse.data;

          const cartItems =
            Array.isArray(
              cartData
            )
              ? cartData
              : Array.isArray(
                  cartData?.cartItems
                )
              ? cartData.cartItems
              : [];

          const productExists =
            cartItems.some(
              (item) =>
                String(
                  item.productId
                ) === String(id)
            );

          setIsInCart(
            productExists
          );
        } catch (cartError) {
          console.error(
            "Unable to load cart:",
            cartError
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load product details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    loadReviews();
  }, [id]);

  // ================= QUANTITY =================

  const handleDecreaseQuantity = () => {
    setQuantity(
      (currentQuantity) =>
        Math.max(
          1,
          currentQuantity - 1
        )
    );
  };

  const handleIncreaseQuantity = () => {
    setQuantity(
      (currentQuantity) =>
        Math.min(
          product.stock,
          currentQuantity + 1
        )
    );
  };

  // ================= CART =================

  const handleAddToCart = async () => {
    if (isInCart) {
      navigate("/cart");
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(
        product.id,
        quantity
      );

      setIsInCart(true);

      window.dispatchEvent(
        new Event(
          "shopsphereCountsUpdated"
        )
      );

      setMessage(
        `${product.name} was added to your cart.`
      );

      setMessageType(
        "success"
      );
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to add the product to your cart."
      );

      setMessageType(
        "error"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // ================= WISHLIST =================

  const handleAddToWishlist =
    async () => {
      if (isInWishlist) {
        navigate("/wishlist");
        return;
      }

      try {
        setAddingToWishlist(
          true
        );

        await addToWishlist(
          product.id
        );

        setIsInWishlist(
          true
        );

        window.dispatchEvent(
          new Event(
            "shopsphereCountsUpdated"
          )
        );

        setMessage(
          `${product.name} was added to your wishlist.`
        );

        setMessageType(
          "success"
        );
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Unable to add the product to your wishlist.";

        if (
          errorMessage
            .toLowerCase()
            .includes(
              "already"
            )
        ) {
          setIsInWishlist(
            true
          );
        }

        setMessage(
          errorMessage
        );

        setMessageType(
          "error"
        );
      } finally {
        setAddingToWishlist(
          false
        );
      }
    };

  // ================= ADD OR UPDATE REVIEW =================

  const handleSubmitReview =
    async () => {
      if (!token) {
        setMessage(
          "Please log in to write a review."
        );

        setMessageType(
          "error"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);

        return;
      }

      if (
        !reviewRating ||
        reviewRating < 1
      ) {
        setMessage(
          "Please select a rating."
        );

        setMessageType(
          "error"
        );

        return;
      }

      if (
        reviewComment
          .trim()
          .length === 0
      ) {
        setMessage(
          "Please write a review."
        );

        setMessageType(
          "error"
        );

        return;
      }

      try {
        setSubmittingReview(
          true
        );

        const reviewData = {
          productId:
            Number(id),
          rating:
            reviewRating,
          comment:
            reviewComment.trim(),
        };

        if (
          editingReviewId
        ) {
          await updateReview(
            editingReviewId,
            reviewData
          );

          setMessage(
            "Review updated successfully."
          );
        } else {
          await addReview(
            reviewData
          );

          setMessage(
            "Review added successfully."
          );
        }

        setMessageType(
          "success"
        );

        setReviewRating(5);

        setReviewComment("");

        setEditingReviewId(
          null
        );

        await loadReviews();
      } catch (reviewError) {
        setMessage(
          reviewError.response
            ?.data?.message ||
            reviewError.response
            ?.data ||
            "Unable to save your review."
        );

        setMessageType(
          "error"
        );
      } finally {
        setSubmittingReview(
          false
        );
      }
    };

  // ================= EDIT REVIEW =================

  const handleEditReview = (
    review
  ) => {
    setEditingReviewId(
      review.reviewId
    );

    setReviewRating(
      review.rating
    );

    setReviewComment(
      review.comment
    );

    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior:
        "smooth",
    });
  };

  // ================= CANCEL EDIT =================

  const handleCancelEdit = () => {
    setEditingReviewId(
      null
    );

    setReviewRating(5);

    setReviewComment("");
  };

  // ================= DELETE REVIEW =================

  const handleDeleteReview =
    async (reviewId) => {
      const shouldDelete =
        window.confirm(
          "Are you sure you want to delete this review?"
        );

      if (!shouldDelete) {
        return;
      }

      try {
        setDeletingReviewId(
          reviewId
        );

        await deleteReview(
          reviewId
        );

        setReviews(
          (currentReviews) =>
            currentReviews.filter(
              (review) =>
                review.reviewId !==
                reviewId
            )
        );

        setMessage(
          "Review deleted successfully."
        );

        setMessageType(
          "success"
        );
      } catch (reviewError) {
        setMessage(
          reviewError.response
            ?.data?.message ||
            reviewError.response
            ?.data ||
            "Unable to delete review."
        );

        setMessageType(
          "error"
        );
      } finally {
        setDeletingReviewId(
          null
        );
      }
    };

  // ================= REVIEW CALCULATIONS =================

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (
            total,
            review
          ) =>
            total +
            Number(
              review.rating
            ),
          0
        ) / reviews.length
      : 0;

  // ================= LOADING =================

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

  // ================= ERROR =================

  if (error) {
    return (
      <Container
        sx={{
          py: 6,
        }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  // ================= PRODUCT NOT FOUND =================

  if (!product) {
    return (
      <Container
        sx={{
          py: 6,
        }}
      >
        <Alert severity="warning">
          Product not found.
        </Alert>
      </Container>
    );
  }

  const isInStock =
    product.stock > 0;

  // ================= UI =================

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
        }}
      >
        {/* PRODUCT DETAILS */}

        <Paper
          elevation={2}
          sx={{
            p: {
              xs: 2,
              sm: 4,
            },
            borderRadius: 4,
          }}
        >
          <Grid
            container
            spacing={5}
          >
            {/* IMAGE */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box
                sx={{
                  minHeight:
                    450,
                  display:
                    "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  backgroundColor:
                    "#f8f8f8",
                  borderRadius:
                    3,
                  p: 4,
                }}
              >
                <Box
                  component="img"
                  src={
                    product.imageUrl ||
                    iphone16Image
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
                    width:
                      "100%",
                    maxWidth:
                      420,
                    maxHeight:
                      420,
                    objectFit:
                      "contain",
                  }}
                />
              </Box>
            </Grid>

            {/* INFORMATION */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Stack
                spacing={2.5}
              >
                <Chip
                  label={
                    product.categoryName
                  }
                  color="primary"
                  variant="outlined"
                  sx={{
                    alignSelf:
                      "flex-start",
                  }}
                />

                <Typography
                  variant="h3"
                  fontWeight="bold"
                >
                  {product.name}
                </Typography>

                {/* PRODUCT RATING */}

                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 1,
                  }}
                >
                  <Rating
                    value={
                      averageRating
                    }
                    precision={
                      0.5
                    }
                    readOnly
                  />

                  <Typography
                    fontWeight={
                      700
                    }
                  >
                    {averageRating.toFixed(
                      1
                    )}
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    (
                    {
                      reviews.length
                    }{" "}
                    review
                    {reviews.length !==
                    1
                      ? "s"
                      : ""}
                    )
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight:
                      1.8,
                  }}
                >
                  {
                    product.description
                  }
                </Typography>

                <Divider />

                <Typography
                  variant="h4"
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
                  variant="body1"
                  fontWeight="bold"
                  color={
                    isInStock
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {isInStock
                    ? `${product.stock} items available`
                    : "Out of stock"}
                </Typography>

                {/* QUANTITY */}

                <Box>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      mb: 1,
                    }}
                  >
                    Quantity
                  </Typography>

                  <Box
                    sx={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      border:
                        "1px solid",
                      borderColor:
                        "divider",
                      borderRadius:
                        2,
                      overflow:
                        "hidden",
                    }}
                  >
                    <IconButton
                      onClick={
                        handleDecreaseQuantity
                      }
                      disabled={
                        quantity <=
                        1
                      }
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography
                      sx={{
                        minWidth:
                          45,
                        textAlign:
                          "center",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {quantity}
                    </Typography>

                    <IconButton
                      onClick={
                        handleIncreaseQuantity
                      }
                      disabled={
                        quantity >=
                        product.stock
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* BUTTONS */}

                <Stack
                  direction={{
                    xs:
                      "column",
                    sm:
                      "row",
                  }}
                  spacing={2}
                  sx={{
                    pt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    disabled={
                      !isInStock ||
                      addingToCart
                    }
                    onClick={
                      handleAddToCart
                    }
                    startIcon={
                      addingToCart ? (
                        <CircularProgress
                          size={20}
                          color="inherit"
                        />
                      ) : (
                        <ShoppingCartOutlinedIcon />
                      )
                    }
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius:
                        2,
                      textTransform:
                        "none",
                      fontSize:
                        "1rem",
                    }}
                  >
                    {addingToCart
                      ? "Adding..."
                      : isInCart
                      ? "Go to Cart"
                      : "Add to Cart"}
                  </Button>

                  <Button
                    variant={
                      isInWishlist
                        ? "contained"
                        : "outlined"
                    }
                    size="large"
                    disabled={
                      addingToWishlist
                    }
                    onClick={
                      handleAddToWishlist
                    }
                    startIcon={
                      addingToWishlist ? (
                        <CircularProgress
                          size={20}
                          color="inherit"
                        />
                      ) : isInWishlist ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )
                    }
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius:
                        2,
                      textTransform:
                        "none",
                      fontSize:
                        "1rem",
                    }}
                  >
                    {addingToWishlist
                      ? "Adding..."
                      : isInWishlist
                      ? "View Wishlist"
                      : "Add to Wishlist"}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* REVIEWS */}

        <Paper
          elevation={2}
          sx={{
            mt: 5,
            p: {
              xs: 2,
              sm: 4,
            },
            borderRadius:
              4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Customer Reviews
          </Typography>

          <Box
            sx={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 2,
              mt: 2,
              mb: 4,
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
            >
              {averageRating.toFixed(
                1
              )}
            </Typography>

            <Box>
              <Rating
                value={
                  averageRating
                }
                precision={
                  0.5
                }
                readOnly
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Based on{" "}
                {
                  reviews.length
                }{" "}
                review
                {reviews.length !==
                1
                  ? "s"
                  : ""}
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              mb: 4,
            }}
          />

          {/* REVIEW LIST */}

          {reviewsLoading ? (
            <Box
              sx={{
                display:
                  "flex",
                justifyContent:
                  "center",
                py: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : reviews.length ===
            0 ? (
            <Box
              sx={{
                textAlign:
                  "center",
                py: 5,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                No reviews yet
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                Be the first customer
                to review this product.
              </Typography>
            </Box>
          ) : (
            <Stack
              spacing={3}
            >
              {reviews.map(
                (review) => (
                  <Paper
                    key={
                      review.reviewId
                    }
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius:
                        3,
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        gap: 2,
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <Box>
                        <Typography
                          fontWeight="bold"
                        >
                          {
                            review.customerName
                          }
                        </Typography>

                        <Rating
                          value={
                            review.rating
                          }
                          readOnly
                          size="small"
                          sx={{
                            mt: 0.5,
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {review.reviewDate
                          ? new Date(
                              review.reviewDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day:
                                  "numeric",
                                month:
                                  "short",
                                year:
                                  "numeric",
                              }
                            )
                          : ""}
                      </Typography>
                    </Box>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 2,
                        lineHeight:
                          1.7,
                      }}
                    >
                      {
                        review.comment
                      }
                    </Typography>

                    {/* Edit and delete are shown for all reviews
                        for now because the backend already checks
                        ownership securely. */}

                    {token && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          mt: 2,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() =>
                            handleEditReview(
                              review
                            )
                          }
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
                          disabled={
                            deletingReviewId ===
                            review.reviewId
                          }
                          onClick={() =>
                            handleDeleteReview(
                              review.reviewId
                            )
                          }
                          sx={{
                            textTransform:
                              "none",
                          }}
                        >
                          {deletingReviewId ===
                          review.reviewId
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </Stack>
                    )}
                  </Paper>
                )
              )}
            </Stack>
          )}

          {/* REVIEW FORM */}

          <Divider
            sx={{
              my: 5,
            }}
          />

          <Typography
            variant="h5"
            fontWeight="bold"
          >
            {editingReviewId
              ? "Edit Your Review"
              : "Write a Review"}
          </Typography>

          {!token && (
            <Alert
              severity="info"
              sx={{
                mt: 2,
              }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() =>
                    navigate(
                      "/login"
                    )
                  }
                >
                  Login
                </Button>
              }
            >
              Please log in to write
              a review.
            </Alert>
          )}

          <Stack
            spacing={2.5}
            sx={{
              mt: 3,
            }}
          >
            <Box>
              <Typography
                fontWeight="bold"
                sx={{
                  mb: 1,
                }}
              >
                Your Rating
              </Typography>

              <Rating
                value={
                  reviewRating
                }
                onChange={(
                  event,
                  newValue
                ) =>
                  setReviewRating(
                    newValue ||
                      1
                  )
                }
                size="large"
                disabled={
                  !token ||
                  submittingReview
                }
              />
            </Box>

            <TextField
              label="Write your review"
              multiline
              minRows={4}
              value={
                reviewComment
              }
              onChange={(
                event
              ) =>
                setReviewComment(
                  event.target
                    .value
                )
              }
              disabled={
                !token ||
                submittingReview
              }
              fullWidth
            />

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
                disabled={
                  !token ||
                  submittingReview
                }
                onClick={
                  handleSubmitReview
                }
                sx={{
                  textTransform:
                    "none",
                  borderRadius:
                    2,
                  px: 4,
                }}
              >
                {submittingReview
                  ? "Saving..."
                  : editingReviewId
                  ? "Update Review"
                  : "Submit Review"}
              </Button>

              {editingReviewId && (
                <Button
                  variant="outlined"
                  onClick={
                    handleCancelEdit
                  }
                  sx={{
                    textTransform:
                      "none",
                    borderRadius:
                      2,
                  }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {/* MESSAGE */}

      <Snackbar
        open={
          Boolean(message)
        }
        autoHideDuration={
          3000
        }
        onClose={() =>
          setMessage("")
        }
        anchorOrigin={{
          vertical:
            "bottom",
          horizontal:
            "center",
        }}
      >
        <Alert
          severity={
            messageType
          }
          variant="filled"
          onClose={() =>
            setMessage("")
          }
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductDetails;