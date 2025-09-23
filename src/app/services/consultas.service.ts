import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConsultasService {

  private base ='http://localhost:8080/api';
  private base1 = 'http://localhost:8080/api/reclamos';

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
}
