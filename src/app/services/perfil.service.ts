import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private apiUrl = 'http://localhost:8080/api/registro';

  constructor(private http: HttpClient) {}

  obtenerPerfil(idCliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idCliente}`);
  }

  actualizarPerfil(idCliente: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idCliente}`, datos);
  }
}
