import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CruceService {

  private apiUrl = `${environment.apiUrl}/transitos`;

  constructor(private http: HttpClient) {}

  // Obtener tránsitos por ID de cliente
  getTransitosPorCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }
}
