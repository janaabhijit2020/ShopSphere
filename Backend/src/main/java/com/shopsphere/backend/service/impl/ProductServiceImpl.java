package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.product.ProductRequest;
import com.shopsphere.backend.dto.product.ProductResponse;
import com.shopsphere.backend.entity.Category;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.repository.CategoryRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.service.ProductService;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServiceImpl
        implements ProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository
    ) {

        this.productRepository =
                productRepository;

        this.categoryRepository =
                categoryRepository;
    }

    // ==================================================
    // CREATE PRODUCT
    // ==================================================

    @Override
    public ProductResponse createProduct(
            ProductRequest request
    ) {

        Category category =
                categoryRepository
                        .findById(
                                request.getCategoryId()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Category not found"
                                        )
                        );

        Product product =
                new Product();

        product.setName(
                request.getName()
        );

        product.setDescription(
                request.getDescription()
        );

        product.setPrice(
                request.getPrice()
        );

        product.setStock(
                request.getStock()
        );

        product.setImageUrl(
                request.getImageUrl()
        );

        product.setCategory(
                category
        );

        Product savedProduct =
                productRepository.save(
                        product
                );

        return mapToResponse(
                savedProduct
        );
    }

    // ==================================================
    // GET ALL PRODUCTS
    // ==================================================

    @Override
    public List<ProductResponse>
    getAllProducts() {

        return productRepository
                .findAll()
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();
    }

    // ==================================================
    // PAGINATION
    // ==================================================

    @Override
    public List<ProductResponse>
    getProductsWithPagination(
            int page,
            int size
    ) {

        if (
                page < 0
        ) {

            throw new RuntimeException(
                    "Page number cannot be negative"
            );
        }

        if (
                size <= 0
        ) {

            throw new RuntimeException(
                    "Page size must be greater than zero"
            );
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );

        return productRepository
                .findAll(
                        pageable
                )
                .getContent()
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();
    }

    // ==================================================
    // GET PRODUCT BY ID
    // ==================================================

    @Override
    public ProductResponse
    getProductById(
            Long id
    ) {

        Product product =
                productRepository
                        .findById(
                                id
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Product not found"
                                        )
                        );

        return mapToResponse(
                product
        );
    }

    // ==================================================
    // UPDATE PRODUCT
    // ==================================================

    @Override
    public ProductResponse
    updateProduct(
            Long id,
            ProductRequest request
    ) {

        Product product =
                productRepository
                        .findById(
                                id
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Product not found"
                                        )
                        );

        Category category =
                categoryRepository
                        .findById(
                                request.getCategoryId()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Category not found"
                                        )
                        );

        product.setName(
                request.getName()
        );

        product.setDescription(
                request.getDescription()
        );

        product.setPrice(
                request.getPrice()
        );

        product.setStock(
                request.getStock()
        );

        product.setImageUrl(
                request.getImageUrl()
        );

        product.setCategory(
                category
        );

        Product updatedProduct =
                productRepository.save(
                        product
                );

        return mapToResponse(
                updatedProduct
        );
    }

    // ==================================================
    // UPDATE PRODUCT STOCK
    // ==================================================

    @Override
    public ProductResponse
    addStock(
            Long id,
            Integer quantity
    ) {

        // Quantity cannot be null or zero

        if (
                quantity == null
                        ||
                        quantity == 0
        ) {

            throw new RuntimeException(
                    "Stock quantity cannot be zero"
            );
        }

        Product product =
                productRepository
                        .findById(
                                id
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Product not found"
                                        )
                        );

        int currentStock =
                product.getStock();

        int updatedStock =
                currentStock
                        +
                        quantity;

        // Stock cannot become negative

        if (
                updatedStock < 0
        ) {

            throw new RuntimeException(
                    "Stock cannot be less than zero"
            );
        }

        product.setStock(
                updatedStock
        );

        Product savedProduct =
                productRepository.save(
                        product
                );

        return mapToResponse(
                savedProduct
        );
    }

    // ==================================================
    // DELETE PRODUCT
    // ==================================================

    @Override
    public void deleteProduct(
            Long id
    ) {

        Product product =
                productRepository
                        .findById(
                                id
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Product not found"
                                        )
                        );

        productRepository.delete(
                product
        );
    }

    // ==================================================
    // SEARCH PRODUCTS
    // ==================================================

    @Override
    public List<ProductResponse>
    searchProducts(
            String keyword
    ) {

        return filterProducts(

                keyword,

                null,

                null,

                null,

                null
        );
    }

    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    @Override
    public List<ProductResponse>
    getProductsByCategory(
            Long categoryId
    ) {

        return filterProducts(

                null,

                categoryId,

                null,

                null,

                null
        );
    }

    // ==================================================
    // PRICE FILTER
    // ==================================================

    @Override
    public List<ProductResponse>
    filterByPrice(
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {

        if (
                minPrice != null
                        &&
                        maxPrice != null
                        &&
                        minPrice.compareTo(
                                maxPrice
                        ) > 0
        ) {

            throw new RuntimeException(
                    "Minimum price cannot be greater than maximum price"
            );
        }

        return filterProducts(

                null,

                null,

                minPrice,

                maxPrice,

                null
        );
    }

    // ==================================================
    // PRICE LOW TO HIGH
    // ==================================================

    @Override
    public List<ProductResponse>
    sortByPriceAsc() {

        return filterProducts(

                null,

                null,

                null,

                null,

                "priceAsc"
        );
    }

    // ==================================================
    // PRICE HIGH TO LOW
    // ==================================================

    @Override
    public List<ProductResponse>
    sortByPriceDesc() {

        return filterProducts(

                null,

                null,

                null,

                null,

                "priceDesc"
        );
    }

    // ==================================================
    // LATEST PRODUCTS
    // ==================================================

    @Override
    public List<ProductResponse>
    getLatestProducts() {

        return filterProducts(

                null,

                null,

                null,

                null,

                "latest"
        );
    }

    // ==================================================
    // COMBINED SEARCH, FILTER AND SORT
    // ==================================================

    @Override
    public List<ProductResponse>
    filterProducts(

            String keyword,

            Long categoryId,

            BigDecimal minPrice,

            BigDecimal maxPrice,

            String sort
    ) {

        if (
                minPrice != null
                        &&
                        maxPrice != null
                        &&
                        minPrice.compareTo(
                                maxPrice
                        ) > 0
        ) {

            throw new RuntimeException(
                    "Minimum price cannot be greater than maximum price"
            );
        }

        Specification<Product>
                specification =

                (
                        root,
                        query,
                        criteriaBuilder
                ) -> {

                    List<Predicate>
                            predicates =

                            new ArrayList<>();

                    // SEARCH BY PRODUCT NAME

                    if (

                            keyword != null

                                    &&

                                    !keyword
                                            .trim()
                                            .isEmpty()
                    ) {

                        predicates.add(

                                criteriaBuilder.like(

                                        criteriaBuilder.lower(

                                                root.get(
                                                        "name"
                                                )
                                        ),

                                        "%"

                                                +

                                                keyword
                                                        .trim()
                                                        .toLowerCase()

                                                +

                                                "%"
                                )
                        );
                    }

                    // CATEGORY FILTER

                    if (
                            categoryId != null
                    ) {

                        predicates.add(

                                criteriaBuilder.equal(

                                        root.get(
                                                        "category"
                                                )
                                                .get(
                                                        "id"
                                                ),

                                        categoryId
                                )
                        );
                    }

                    // MINIMUM PRICE

                    if (
                            minPrice != null
                    ) {

                        predicates.add(

                                criteriaBuilder
                                        .greaterThanOrEqualTo(

                                                root.get(
                                                        "price"
                                                ),

                                                minPrice
                                        )
                        );
                    }

                    // MAXIMUM PRICE

                    if (
                            maxPrice != null
                    ) {

                        predicates.add(

                                criteriaBuilder
                                        .lessThanOrEqualTo(

                                                root.get(
                                                        "price"
                                                ),

                                                maxPrice
                                        )
                        );
                    }

                    return criteriaBuilder.and(

                            predicates.toArray(

                                    new Predicate[0]
                            )
                    );
                };

        // ==================================================
        // SORTING
        // ==================================================

        Sort sorting =
                Sort.unsorted();

        if (

                "priceAsc"
                        .equalsIgnoreCase(
                                sort
                        )
        ) {

            sorting =

                    Sort.by(

                            Sort.Direction.ASC,

                            "price"
                    );

        } else if (

                "priceDesc"
                        .equalsIgnoreCase(
                                sort
                        )
        ) {

            sorting =

                    Sort.by(

                            Sort.Direction.DESC,

                            "price"
                    );

        } else if (

                "latest"
                        .equalsIgnoreCase(
                                sort
                        )
        ) {

            sorting =

                    Sort.by(

                            Sort.Direction.DESC,

                            "id"
                    );
        }

        return productRepository

                .findAll(

                        specification,

                        sorting
                )

                .stream()

                .map(
                        this::mapToResponse
                )

                .toList();
    }

    // ==================================================
    // PRODUCT RESPONSE MAPPER
    // ==================================================

    private ProductResponse
    mapToResponse(
            Product product
    ) {

        ProductResponse response =
                new ProductResponse();

        response.setId(
                product.getId()
        );

        response.setName(
                product.getName()
        );

        response.setDescription(
                product.getDescription()
        );

        response.setPrice(
                product.getPrice()
        );

        response.setStock(
                product.getStock()
        );

        response.setImageUrl(
                product.getImageUrl()
        );

        response.setCategoryName(

                product
                        .getCategory()
                        .getName()
        );

        return response;
    }
}