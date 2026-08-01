package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.product.ProductRequest;
import com.shopsphere.backend.dto.product.ProductResponse;
import com.shopsphere.backend.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService
    ) {
        this.productService = productService;
    }

    // ==================================================
    // CREATE PRODUCT
    // ==================================================

    @PostMapping
    public ProductResponse createProduct(
            @Valid
            @RequestBody
            ProductRequest request
    ) {

        return productService.createProduct(
                request
        );
    }

    // ==================================================
    // GET ALL PRODUCTS
    // ==================================================

    @GetMapping
    public List<ProductResponse> getAllProducts() {

        return productService.getAllProducts();
    }

    // ==================================================
    // PAGINATION
    // ==================================================

    @GetMapping("/page")
    public List<ProductResponse>
    getProductsWithPagination(

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "6"
            )
            int size
    ) {

        return productService
                .getProductsWithPagination(
                        page,
                        size
                );
    }

    // ==================================================
    // SEARCH PRODUCTS
    // ==================================================

    @GetMapping("/search")
    public List<ProductResponse>
    searchProducts(

            @RequestParam
            String keyword
    ) {

        return productService.searchProducts(
                keyword
        );
    }

    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    @GetMapping(
            "/category/{categoryId}"
    )
    public List<ProductResponse>
    getProductsByCategory(

            @PathVariable
            Long categoryId
    ) {

        return productService
                .getProductsByCategory(
                        categoryId
                );
    }

    // ==================================================
    // PRICE FILTER
    // ==================================================

    @GetMapping("/filter")
    public List<ProductResponse>
    filterByPrice(

            @RequestParam
            BigDecimal minPrice,

            @RequestParam
            BigDecimal maxPrice
    ) {

        return productService.filterByPrice(
                minPrice,
                maxPrice
        );
    }

    // ==================================================
    // SORT PRICE: LOW TO HIGH
    // ==================================================

    @GetMapping(
            "/sort/price-asc"
    )
    public List<ProductResponse>
    sortPriceAsc() {

        return productService
                .sortByPriceAsc();
    }

    // ==================================================
    // SORT PRICE: HIGH TO LOW
    // ==================================================

    @GetMapping(
            "/sort/price-desc"
    )
    public List<ProductResponse>
    sortPriceDesc() {

        return productService
                .sortByPriceDesc();
    }

    // ==================================================
    // LATEST PRODUCTS
    // ==================================================

    @GetMapping("/latest")
    public List<ProductResponse>
    getLatestProducts() {

        return productService
                .getLatestProducts();
    }

    // ==================================================
    // COMBINED SEARCH, FILTER AND SORT
    // ==================================================

    @GetMapping(
            "/filter-products"
    )
    public List<ProductResponse>
    filterProducts(

            @RequestParam(
                    required = false
            )
            String keyword,

            @RequestParam(
                    required = false
            )
            Long categoryId,

            @RequestParam(
                    required = false
            )
            BigDecimal minPrice,

            @RequestParam(
                    required = false
            )
            BigDecimal maxPrice,

            @RequestParam(
                    required = false
            )
            String sort
    ) {

        return productService
                .filterProducts(

                        keyword,

                        categoryId,

                        minPrice,

                        maxPrice,

                        sort
                );
    }

    // ==================================================
    // ADD PRODUCT STOCK
    // ==================================================

    /*
     * Example:
     *
     * PUT
     * /api/products/1/stock?quantity=10
     *
     * If current stock is 5:
     *
     * New stock = 5 + 10 = 15
     */

    @PutMapping(
            "/{id}/stock"
    )
    public ProductResponse
    addStock(

            @PathVariable
            Long id,

            @RequestParam
            Integer quantity
    ) {

        return productService
                .addStock(

                        id,

                        quantity
                );
    }

    // ==================================================
    // GET PRODUCT BY ID
    // ==================================================

    /*
     * Keep this route below all fixed routes.
     *
     * Examples:
     *
     * GET /api/products/1
     * GET /api/products/2
     */

    @GetMapping("/{id}")
    public ProductResponse
    getProductById(

            @PathVariable
            Long id
    ) {

        return productService
                .getProductById(
                        id
                );
    }

    // ==================================================
    // UPDATE PRODUCT
    // ==================================================

    @PutMapping("/{id}")
    public ProductResponse
    updateProduct(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            ProductRequest request
    ) {

        return productService
                .updateProduct(

                        id,

                        request
                );
    }

    // ==================================================
    // DELETE PRODUCT
    // ==================================================

    @DeleteMapping("/{id}")
    public String
    deleteProduct(

            @PathVariable
            Long id
    ) {

        productService
                .deleteProduct(
                        id
                );

        return "Product deleted successfully";
    }
}