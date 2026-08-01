import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
} from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#0F172A",
        color: "#FFFFFF",
        mt: 8,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
        >
          {/* ShopSphere Information */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
            >
              ShopSphere
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#CBD5E1",
                lineHeight: 1.7,
                maxWidth: 330,
              }}
            >
              Your one-stop destination for quality
              products, secure shopping, and fast
              delivery.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
            >
              Quick Links
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Link
                href="/"
                underline="hover"
                color="inherit"
                sx={{
                  width: "fit-content",
                  color: "#CBD5E1",
                }}
              >
                Home
              </Link>

              <Link
                href="/products"
                underline="hover"
                color="inherit"
                sx={{
                  width: "fit-content",
                  color: "#CBD5E1",
                }}
              >
                Products
              </Link>

              <Link
                href="/login"
                underline="hover"
                color="inherit"
                sx={{
                  width: "fit-content",
                  color: "#CBD5E1",
                }}
              >
                Login
              </Link>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
            >
              Contact
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                color: "#CBD5E1",
              }}
            >
              <Typography variant="body2">
                Email: support@shopsphere.com
              </Typography>

              <Typography variant="body2">
                Phone: +91 8617535184
              </Typography>

              <Typography variant="body2">
                Kolkata, India
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mt: 5,
            pt: 3,
            borderTop:
              "1px solid rgba(255, 255, 255, 0.15)",
            color: "#94A3B8",
          }}
        >
          © {new Date().getFullYear()} ShopSphere.
          All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;