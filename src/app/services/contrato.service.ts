import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contrato } from '../models/contrato.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  darBaja(idContrato: number) {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'http://localhost:8080/api/contratos';

  constructor(private http: HttpClient) {}

  listarContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.apiUrl);
  }

  crearContrato(contrato: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, contrato);
  }

  getContratosPorCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }

  listarContratosPorCliente(idCliente: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }
  actualizarContrato(id: number, contrato: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, contrato);
  }

   darDeBaja(idContrato: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idContrato}/baja`, {});
  }

}
