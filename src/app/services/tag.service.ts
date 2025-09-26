import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model'; // Asegúrate que esta ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = 'http://localhost:8080/api/tags'; // Reemplaza con tu URL real

  constructor(private http: HttpClient) {}

  // Obtener todos los TAGs (disponibles y ocupados)
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}`);
  }

  // Obtener solo los TAGs disponibles
  getTagsDisponibles(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/disponibles`);
  }

  cargarArchivoExcel(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  cargarTagsDesdeJson(data: any[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/upload-json`, data);
  } 

 

}
