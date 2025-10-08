import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecargaRequest, Contrato, TransaccionSaldo } from '../models/recarga.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getContratosPrepagoPorCliente(idCliente: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}/contratos/prepago/cliente/${idCliente}`);
  }

  realizarRecarga(data: RecargaRequest): Observable<string> {
    const params = new HttpParams()
      .set('idContrato', data.idContrato)
      .set('monto', data.monto)
      .set('medioPago', data.medioPago)
      .set('descripcion', data.descripcion);

    return this.http.post(`${this.baseUrl}/recargas/realizar`, null, {
      params,
      responseType: 'text'
    });
  }

  getTransaccionesPorContrato(idContrato: number): Observable<TransaccionSaldo[]> {
    return this.http.get<TransaccionSaldo[]>(`${this.baseUrl}/transacciones/contrato/${idContrato}`);
  }
}
