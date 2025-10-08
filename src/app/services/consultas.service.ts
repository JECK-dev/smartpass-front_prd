import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConsultasService {

  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTiposReclamo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/tipos-reclamo`);
  }

  getVehiculosCliente(idCliente: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.base}/reclamos/vehi/${idCliente}`);
  }

  crearReclamo(payload: any): Observable<any> {
    return this.http.post(`${this.base}/reclamos`, payload);
  }

  getReclamos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.base}/reclamos/resolucion-reclamo`);
  }

  actualizarReclamo(reclamo: any): Observable<any> {
    return this.http.put<any>(`${this.base}/reclamos/${reclamo.idReclamo}`, reclamo);
  }
}
