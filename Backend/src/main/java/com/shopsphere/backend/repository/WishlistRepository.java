package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository
        extends JpaRepository<Wishlist, Long> {

    Optional<Wishlist> findByUserIdAndProductId(
            Long userId,
            Long productId
    );

    List<Wishlist> findByUserId(Long userId);

    @Transactional
    void deleteByUserIdAndProductId(
            Long userId,
            Long productId
    );
}