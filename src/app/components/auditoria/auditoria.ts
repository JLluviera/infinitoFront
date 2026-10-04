import { Component, inject, OnInit, signal } from '@angular/core';

import { AuditoriaService } from '../../services/auditoria.service/auditoria.service';
import { Auditoria } from '../../models/auditoria.model.ts';
import { ColumnaTabla,ListaGenericaComponent } from '../lista-generica.component/lista-generica.component';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [ListaGenericaComponent],
  templateUrl: './auditoria.html'
})
export class AuditoriaComponent implements OnInit {

  private auditoriaService = inject(AuditoriaService);

  auditorias = signal<Auditoria[]>([]);

  cursor = signal<number | null>(null);

  hayMas = signal(true);

  cargando = signal(false);

  columnas: ColumnaTabla<Auditoria>[] = [
    {
      header: 'ID',
      field: 'id',
      tipo: 'id'
    },
    {
      header: 'Entidad',
      field: 'nombreEntidad',
      tipo: 'texto'
    },
    {
      header: 'Acción',
      field: 'accion',
      tipo: 'texto'
    },
    {
      header: 'Usuario',
      field: 'usuarioId',
      tipo: 'id'
    },
    {
      header: 'Mail',
      field: 'mailUsuario',
      tipo: 'texto'
    },
    {
      header: 'IP',
      field: 'direccionIp',
      tipo: 'texto'
    },
    {
      header: 'Fecha',
      field: 'timestamp',
      tipo: 'texto'
    }
  ];

  ngOnInit(): void {
    this.cargarAuditoriasInicial();
  }

  cargarAuditoriasInicial(): void {

    this.auditorias.set([]);
    this.cursor.set(null);
    this.hayMas.set(true);

    this.cargarAuditorias();
  }

  cargarAuditorias(): void {

    if (this.cargando() || !this.hayMas()) {
      return;
    }

    this.cargando.set(true);

    this.auditoriaService
      .obtenerAuditoriasPaginado(this.cursor())
      .subscribe({
        next: pagina => {

          this.auditorias.update(actuales => [
            ...actuales,
            ...pagina.elementos
          ]);

          this.cursor.set(pagina.siguienteCursor);

          this.hayMas.set(pagina.hayMas);

          this.cargando.set(false);
        },

        error: error => {

          console.error(
            'Error al obtener auditorías:',
            error
          );

          this.cargando.set(false);
        }
      });
  }
}