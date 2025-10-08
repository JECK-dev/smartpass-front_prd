import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoCuentaService {

  private baseUrl = `${environment.apiUrl}/estado-cuenta`;
  private contratoUrl = `${environment.apiUrl}/contratos`; 

  constructor(private http: HttpClient) {}

  // ==== MOVIMIENTOS ====
  getMovimientos(idContrato: number, periodo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/movimientos/contrato/${idContrato}`, {
      params: { periodo }
    });
  }

  getMovimientosPorCliente(idCliente: number, idContrato: number, periodo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/movimientos/cliente/${idCliente}/contrato/${idContrato}`, {
      params: { periodo }
    });
  }

  // ==== CONTRATOS ====
  getContratosPorTipo(tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.contratoUrl}/tipo/${tipo}`);
  }

  getContratosPorTipoCliente(tipo: string, idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.contratoUrl}/tipo/${tipo}/cliente/${idCliente}`);
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
