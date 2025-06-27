package com.sirenah.backend.controller;

import com.sirenah.backend.model.Contactanos;
import com.sirenah.backend.service.ContactanosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todosroles/contactanos")
@CrossOrigin(origins = "*")
public class ContactanosController {

    @Autowired
    private ContactanosService contactanosService;

    // Guardar mensaje de contacto
    @PostMapping
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'EMPLEADO')")
    public Contactanos guardarMensaje(@RequestBody Contactanos contacto) {
        return contactanosService.guardarMensaje(contacto);
    }

    // Listar todos los mensajes
    @GetMapping
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'EMPLEADO')")
    public List<Contactanos> listarMensajes() {
        return contactanosService.listar();
    }

    // Buscar mensaje por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'EMPLEADO')")
    public Optional<Contactanos> buscarPorId(@PathVariable Integer id) {
        return contactanosService.buscarPorId(id);
    }

    // Eliminar mensaje por ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'EMPLEADO')")
    public void eliminarPorId(@PathVariable Integer id) {
        contactanosService.eliminarPorId(id);
    }
}