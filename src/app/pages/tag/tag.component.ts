import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Tag } from '../../models/tag.model';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-tag',
  imports: [FormsModule,CommonModule],
  templateUrl: './tag.component.html',
  styleUrls:[ './tag.component.css']
})
export class TagComponent implements OnInit {
  listaTags: Tag[] = [];
  listaTagsFiltrados: Tag[] = [];


  filtroEstado: string = 'todos';
  busquedaId: number | null = null;

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.obtenerTodosLosTags(); // cargar todos al inicio
  }

  obtenerTodosLosTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (tags) => {
        this.listaTags = tags;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener los tags', err)
    });
  }

  aplicarFiltros(): void {
    this.listaTagsFiltrados = this.listaTags.filter(tag => {
      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'disponibles' && tag.disponible) ||
        (this.filtroEstado === 'ocupados' && !tag.disponible);

      const coincideId = this.busquedaId === null || tag.numTag === this.busquedaId;

      return coincideEstado && coincideId;
    });
  }

  cargarArchivoExcel(event: any): void {
    // lógica existente para subir Excel
  }
}
