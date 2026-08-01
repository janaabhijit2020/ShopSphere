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
  CircularProgress,
  Divider,
  Paper,
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  addReview,
  getReviewsByProduct,
} from "../../services/reviewService";

function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const token =
    localStorage.getItem("token");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getReviewsByProduct(
          productId
        );

      setReviews(response.data);
    } catch (error) {
      console.error(
        "Failed to load reviews:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmitReview =
    async (event) => {
      event.preventDefault();

      if (!token) {
        setError(
          "Please log in to write a review."
        );

        return;
      }

      if (!rating) {
        setError(
          "Please select a rating."
        );

        return;
      }

      if (!comment.trim()) {
        setError(
          "Please write a review."
        );

        return;
      }

      try {
        setSubmitting(true);
        setError("");

        const response =
          await addReview(
            productId,
            rating,
            comment.trim()
          );

        setReviews(
          (currentReviews) => [
            response.data,
            ...currentReviews,
          ]
        );

        setRating(5);
        setComment("");

        setSuccessMessage(
          "Your review was added successfully."
        );
      } catch (error) {
        console.error(
          "Failed to add review:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to add your review."
        );
      } finally {
        setSubmitting(false);
      }
    };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total + review.rating,
          0
        ) / reviews.length
      : 0;

  return (
    <Box
      sx={{
        mt: 6,
      }}
    >
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
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Customer Reviews
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 2,
            mb: 3,
          }}
        >
          <Rating
            value={averageRating}
            precision={0.1}
            readOnly
          />

          <Typography
            fontWeight="bold"
          >
            {averageRating.toFixed(1)}
          </Typography>

          <Typography
            color="text.secondary"
          >
            ({reviews.length} review
            {reviews.length !== 1
              ? "s"
              : ""}
            )
          </Typography>
        </Box>

        <Divider
          sx={{
            mb: 4,
          }}
        />

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

        {token && (
          <Paper
            variant="outlined"
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
              mb: 4,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Write a Review
            </Typography>

            <Box
              component="form"
              onSubmit={
                handleSubmitReview
              }
              sx={{
                mt: 2,
              }}
            >
              <Typography
                fontWeight="medium"
                sx={{
                  mb: 1,
                }}
              >
                Your Rating
              </Typography>

              <Rating
                value={rating}
                onChange={(
                  event,
                  newRating
                ) =>
                  setRating(
                    newRating
                  )
                }
                size="large"
              />

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Your Review"
                placeholder="Tell other customers what you think..."
                value={comment}
                onChange={(
                  event
                ) =>
                  setComment(
                    event.target.value
                  )
                }
                sx={{
                  mt: 2,
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={
                  submitting
                }
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform:
                    "none",
                }}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Review"}
              </Button>
            </Box>
          </Paper>
        )}

        {!token && (
          <Alert
            severity="info"
            sx={{
              mb: 4,
            }}
          >
            Log in to write a review.
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              py: 5,
              display: "flex",
              justifyContent:
                "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign:
                "center",
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
            spacing={2}
          >
            {reviews.map(
              (review) => (
                <Card
                  key={
                    review.reviewId
                  }
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
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

                        gap: 2,
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
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(
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
                        )}
                      </Typography>
                    </Box>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 2,
                        whiteSpace:
                          "pre-wrap",
                      }}
                    >
                      {
                        review.comment
                      }
                    </Typography>
                  </CardContent>
                </Card>
              )
            )}
          </Stack>
        )}
      </Paper>

      <Snackbar
        open={Boolean(
          successMessage
        )}
        autoHideDuration={
          3000
        }
        onClose={() =>
          setSuccessMessage(
            ""
          )
        }
        message={
          successMessage
        }
      />
    </Box>
  );
}

export default ReviewSection;