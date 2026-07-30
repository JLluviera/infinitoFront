import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../models/cliente.model';
@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule],
  template: "./lista-clientes.component.html"
})
export class ListaClientesComponent implements OnInit {
  
  // Inyectamos el servicio para pedir los datos a la API de Azure
  private clientesService = inject(ClientesService);

  // Arreglo local donde guardaremos los datos que lleguen del JSON
  clientes: Cliente[] = [];

  // Se ejecuta automáticamente al abrir la vista
  ngOnInit(): void {
    // Nos suscribimos al Observable (encendemos la radio) para recibir la respuesta asíncrona
    this.clientesService.getClientes().subscribe({
      next: (datosRecibidos) => {
        // La API respondió con éxito y el JSON se mapeó a la interfaz Cliente[]
        this.clientes = datosRecibidos;
      },
      error: (error) => {
        console.error('Error al conectar con la API de ASP.NET:', error);
      }
    });
  }
}