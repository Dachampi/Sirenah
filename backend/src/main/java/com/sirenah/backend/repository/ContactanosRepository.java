package com.sirenah.backend.repository;

import com.sirenah.backend.model.Contactanos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactanosRepository extends JpaRepository<Contactanos, Integer> {

}