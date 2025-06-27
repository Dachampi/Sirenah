package com.sirenah.backend.service;

import com.sirenah.backend.model.Contactanos;
import java.util.List;
import java.util.Optional;

public interface ContactanosService {
    Contactanos guardarMensaje(Contactanos contacto);
    List<Contactanos> listar(); // Listar todos los mensajes
    Optional<Contactanos> buscarPorId(Integer id); // Buscar por ID
    void eliminarPorId(Integer id); // Eliminar por ID
}