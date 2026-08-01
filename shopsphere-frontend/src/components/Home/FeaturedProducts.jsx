import { Container, Grid, Typography } from "@mui/material";
import ProductCard from "../Product/ProductCard";

const featuredProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "₹2,999",
    rating: 4.5,
    image: "https://picsum.photos/400/300?random=1",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "₹4,999",
    rating: 4.8,
    image: "https://picsum.photos/400/300?random=2",
  },
  {
    id: 3,
    name: "Gaming Laptop",
    price: "₹69,999",
    rating: 4.7,
    image: "https://picsum.photos/400/300?random=3",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: "₹3,499",
    rating: 4.6,
    image: "https://picsum.photos/400/300?random=4",
  },
];

function FeaturedProducts() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        mb={1}
      >
        ⭐ Featured Products
      </Typography>

      <Typography
        textAlign="center"
        color="text.secondary"
        mb={5}
      >
        Hand-picked products specially selected for you.
      </Typography>

      <Grid container spacing={3}>
        {featuredProducts.map((product) => (
          <Grid
            key={product.id}
            size={{ xs: 12, sm: 6, md: 3 }}
          >
            <ProductCard
              name={product.name}
              price={product.price}
              rating={product.rating}
              image={product.image}
              badge="Featured"
              badgeColor="warning"
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default FeaturedProducts;