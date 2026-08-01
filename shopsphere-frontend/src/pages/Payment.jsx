import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Divider,
} from "@mui/material";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";

import { makePayment } from "../services/paymentService";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      await makePayment(orderId, paymentMethod);

      setPaymentSuccess(true);
    } catch (error) {
      setError(
        error.message || "Payment could not be completed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f5f7fb",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              textAlign: "center",
              borderRadius: 4,
            }}
          >
            <Typography
  sx={{
    fontSize: "80px",
    lineHeight: 1,
    mb: 2,
    color: "success.main",
  }}
>
  ✓
</Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
            >
              Order Placed Successfully!
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Your order has been confirmed.
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Order ID: #{orderId}
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate("/orders")}
              sx={{
                py: 1.4,
                borderRadius: 2,
              }}
            >
              View My Orders
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate("/")}
              sx={{
                mt: 2,
                py: 1.4,
                borderRadius: 2,
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "80vh",
        py: { xs: 4, md: 7 },
        backgroundColor: "#f5f7fb",
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          Payment
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Complete payment for order #{orderId}
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Choose Payment Method
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <RadioGroup
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value)
            }
          >
            <Paper
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 2,
                borderColor:
                  paymentMethod === "COD"
                    ? "primary.main"
                    : "divider",
              }}
            >
              <FormControlLabel
                value="COD"
                control={<Radio />}
                sx={{
                  width: "100%",
                  m: 0,
                  p: 1.5,
                }}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <LocalShippingOutlinedIcon
                      color="primary"
                    />

                    <Box>
                      <Typography fontWeight="bold">
                        Cash on Delivery
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Pay when your order arrives
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor:
                  paymentMethod === "ONLINE"
                    ? "primary.main"
                    : "divider",
              }}
            >
              <FormControlLabel
                value="ONLINE"
                control={<Radio />}
                sx={{
                  width: "100%",
                  m: 0,
                  p: 1.5,
                }}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <CreditCardOutlinedIcon
                      color="primary"
                    />

                    <Box>
                      <Typography fontWeight="bold">
                        Online Payment
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Demo payment using card, UPI, or net banking
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </Paper>
          </RadioGroup>

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 3 }}
            >
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            onClick={handlePayment}
            sx={{
              mt: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="inherit"
              />
            ) : paymentMethod === "COD" ? (
              "Place Order"
            ) : (
              "Pay Now"
            )}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Payment;