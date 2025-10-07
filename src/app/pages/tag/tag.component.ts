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
  tagsPaginados: Tag[] = [];
  paginaActual: number = 1;
  tamañoPagina: number = 25;
  totalPaginas: number = 1;



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
        this.totalPaginas = Math.ceil(this.listaTagsFiltrados.length / this.tamañoPagina);
        this.actualizarPagina();
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
    this.totalPaginas = Math.ceil(this.listaTagsFiltrados.length / this.tamañoPagina);
    this.actualizarPagina();
  }

  cargarArchivoExcel(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // leer la primera hoja
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      // 👇 transformar para que coincida con Tag del backend
      const tags = jsonData.map((row: any) => ({
        numTag: row.num_tag,            // Excel: num_tag → Java: numTag
        plaza: { numPlaza: row.id_plaza } // Excel: id_plaza → Java: plaza.numPlaza
      }));

      console.log('JSON listo para enviar:', tags);

      // enviar al backend
      this.tagService.cargarTagsDesdeJson(tags).subscribe({
        next: (response) => {
          alert(`${response.message} ✅ Total registros: ${response.totalRegistros}`);
          console.log('Respuesta backend:', response);
        },
        error: (err) => {
          alert('Error al cargar ❌');
          console.error(err);
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }

  //listas paginación
  actualizarPagina(): void {
  const inicio = (this.paginaActual - 1) * this.tamañoPagina;
  const fin = inicio + this.tamañoPagina;
  this.tagsPaginados = this.listaTagsFiltrados.slice(inicio, fin);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPagina();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPagina();
    }
}

}
