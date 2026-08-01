import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
} from "@mui/material";

const deals = [
  {
    title: "Electronics Sale",
    discount: "Up to 50% OFF",
    color: "#2563EB",
  },
  {
    title: "Fashion Festival",
    discount: "Flat 40% OFF",
    color: "#EC4899",
  },
  {
    title: "Home Essentials",
    discount: "Save 30%",
    color: "#10B981",
  },
];

function TodaysDeals() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={1}
      >
        🔥 Today's Deals
      </Typography>

      <Typography
        textAlign="center"
        color="text.secondary"
        mb={5}
      >
        Grab today's best offers before they're gone.
      </Typography>

      <Grid container spacing={3}>
        {deals.map((deal) => (
          <Grid key={deal.title} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: deal.color,
                  color: "#fff",
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {deal.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  mt={2}
                >
                  {deal.discount}
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: "#fff",
                    color: deal.color,
                    fontWeight: "bold",
                    borderRadius: 3,
                    "&:hover": {
                      backgroundColor: "#F3F4F6",
                    },
                  }}
                >
                  Shop Now
                </Button>
              </Box>

              <CardContent>
                <Typography color="text.secondary">
                  Limited-time offer on selected products.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TodaysDeals;