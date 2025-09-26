import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoCuentaService {

  private baseUrl = 'http://localhost:8080/api/estado-cuenta'; // Ajusta al dominio real

  constructor(private http: HttpClient) { }

  getPrepago(idContrato: number, periodo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/prepago/${idContrato}?periodo=${periodo}`);
  }

  getPospago(idContrato: number, periodo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pospago/${idContrato}?periodo=${periodo}`);
  }

  getMovimientos(idContrato: number, periodo: string) {
    return this.http.get<any[]>(`${this.baseUrl}/movimientos/contrato/${idContrato}?periodo=${periodo}`);
  }

  getMovimientosPorCliente(idCliente: number, idContrato: number, periodo: string) {
    return this.http.get<any[]>(`${this.baseUrl}/movimientos/cliente/${idCliente}/contrato/${idContrato}?periodo=${periodo}`);
  }

  getContratosPorTipo(tipo: string) {
    return this.http.get<any[]>(`http://localhost:8080/api/contratos/tipo/${tipo}`);
  }

  getContratosPorTipoCliente(tipo: string, idCliente: number) {
    return this.http.get<any[]>(`http://localhost:8080/api/contratos/tipo/${tipo}/cliente/${idCliente}`);
  }

}
