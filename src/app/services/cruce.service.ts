import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CruceService {
  private apiUrl = 'http://localhost:8080/api/transitos';

  constructor(private http: HttpClient) {}

  // Obtener tránsitos por ID de cliente
  getTransitosPorCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }
}
