import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

function Newsletter() {
  return (
    <Box
      sx={{
        background: "#1E3A8A",
        color: "#fff",
        py: 8,
        mt: 6,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={2}
        >
          Subscribe to Our Newsletter
        </Typography>

        <Typography
          mb={4}
          sx={{ opacity: 0.9 }}
        >
          Get exclusive offers, latest products and exciting discounts.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="Enter your email"
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#F97316",
              px: 5,
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#EA580C",
              },
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Newsletter;