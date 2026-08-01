import { Container, Grid, Typography } from "@mui/material";
import ProductCard from "../Product/ProductCard";

const latestProducts = [
  {
    id: 1,
    name: "Bluetooth Speaker",
    price: "₹2,499",
    rating: 4.5,
    image: "https://picsum.photos/400/300?random=11",
  },
  {
    id: 2,
    name: "DSLR Camera",
    price: "₹54,999",
    rating: 4.8,
    image: "https://picsum.photos/400/300?random=12",
  },
  {
    id: 3,
    name: "Office Chair",
    price: "₹8,999",
    rating: 4.4,
    image: "https://picsum.photos/400/300?random=13",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    price: "₹5,999",
    rating: 4.9,
    image: "https://picsum.photos/400/300?random=14",
  },
];

function LatestProducts() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        mb={1}
      >
        🆕 Latest Products
      </Typography>

      <Typography
        textAlign="center"
        color="text.secondary"
        mb={5}
      >
        Fresh arrivals picked just for you.
      </Typography>

      <Grid container spacing={3}>
        {latestProducts.map((product) => (
          <Grid
            key={product.id}
            size={{ xs: 12, sm: 6, md: 3 }}
          >
            <ProductCard
              name={product.name}
              price={product.price}
              rating={product.rating}
              image={product.image}
              badge="Latest"
              badgeColor="success"
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default LatestProducts;