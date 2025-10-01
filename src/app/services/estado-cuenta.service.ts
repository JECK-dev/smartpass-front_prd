import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoCuentaService {

  private baseUrl = 'http://localhost:8080/api/estado-cuenta'; // Ajusta al dominio real

  constructor(private http: HttpClient) { }

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

  // ==== PREPAGO ====
  getPrepagoResumen(idContrato: number, periodo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/prepago/resumen/${idContrato}`, {
      params: { periodo }
    });
  }

  getPrepagoMovimientos(idContrato: number, periodo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/prepago/${idContrato}`, {
      params: { periodo }
    });
  }

  // ==== POSPAGO ====
  getPospagoResumen(idContrato: number, periodo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pospago/resumen/${idContrato}`, {
      params: { periodo }
    });
  }

  getPospagoMovimientos(idContrato: number, periodo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pospago/${idContrato}`, {
      params: { periodo }
    });
  }


}
