// src/app/services/estado-cuenta.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EstadoCuenta } from '../models/estado-cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoCuentaService {
  private api = 'http://localhost:8080/api/transitos';

  constructor(private http: HttpClient) {}

  getContratos(clienteId: number): Observable<any[]> {
    const params = new HttpParams().set('clienteId', clienteId);
    return this.http.get<any[]>(`${this.api}/contratos`, { params });
  }

  getEstadoCuenta(contratoId: number, periodo: string, buscar?: string, page=0, size=100): Observable<any> {
    let params = new HttpParams()
      .set('contratoId', contratoId)
      .set('periodo', periodo)
      .set('page', page)
      .set('size', size);
    if (buscar && buscar.trim().length) {
      params = params.set('buscar', buscar.trim());
    }
    return this.http.get<any>(`${this.api}/estados-cuenta`, { params });
  }
}
