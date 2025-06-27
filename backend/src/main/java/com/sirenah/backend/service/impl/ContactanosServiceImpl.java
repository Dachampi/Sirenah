package com.sirenah.backend.service.impl;

import com.sirenah.backend.model.Contactanos;
import com.sirenah.backend.repository.ContactanosRepository;
import com.sirenah.backend.service.ContactanosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactanosServiceImpl implements ContactanosService {

    @Autowired
    private ContactanosRepository contactanosRepository;

    @Override
    public Contactanos guardarMensaje(Contactanos contacto) {
        return contactanosRepository.save(contacto);
    }

    @Override
    public List<Contactanos> listar() {
        return contactanosRepository.findAll();
    }

    @Override
    public Optional<Contactanos> buscarPorId(Integer id) {
        return contactanosRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Integer id) {
        contactanosRepository.deleteById(id);
    }
}