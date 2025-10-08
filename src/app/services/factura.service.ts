import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private baseUrl = `${environment.apiUrl}/facturacion`;

  constructor(private http: HttpClient) {}

  obtenerFacturasPorCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cliente/${idCliente}`);
  }


  obtenerFacturasFiltradas(idCliente: number, fechaDesde?: string, fechaHasta?: string, nroContrato?: string) {
        let params: any = { idCliente };

        if (fechaDesde) params.fechaDesde = fechaDesde;
        if (fechaHasta) params.fechaHasta = fechaHasta;
        if (nroContrato) params.nroContrato = nroContrato;

        return this.http.get<any[]>(`${this.baseUrl}/filtrar`, { params });
  }
  
  descargarFactura(serie: number, correlativo: string) {
    const url = `${this.baseUrl}/descargar/${serie}/${correlativo}`;
    return this.http.get(url, {
      responseType: 'blob' // <- ¡clave para descargar archivos!
    });
  }
}
