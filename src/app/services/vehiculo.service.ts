import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehiculo } from '../models/vehiculio.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Obtener vehículos por cliente
  getVehiculosPorCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vehiculos/cliente/${idCliente}`);
  }




  // Registrar nuevo vehículo

  registrarVehiculo(vehiculo: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/vehiculos`, vehiculo);
  }


  // Obtener tags disponibles
  getTagsDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tags`);
  }

  // Marcar un tag como usado (disponible = false)
  actualizarTagComoUsado(numTag: string, fechaAsignacion: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/tags/${numTag}`, {
      disponible: false,
      fechaAsignacion: fechaAsignacion
    });
  }

  // Obtener contratos por cliente
  getContratosPorCliente(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/contratos/cliente/${idCliente}`);
  }

  actualizarVehiculo(vehiculo: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/vehiculos/${vehiculo.idVehiculo}`, vehiculo);
  } 

  obtenerVehiculosPorDocumento(documento: string): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.baseUrl}/vehiculos/por-documento/${documento}`);
  }

  // Desafiliar vehículo (actualiza estado a 2)
  desafiliarVehiculo(idVehiculo: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/vehiculos/desafiliar/${idVehiculo}`, {}, { responseType: 'text' });
  }

  //Carga MASIVA
  cargarVehiculos(vehiculos: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/vehiculos/upload-json`, vehiculos);
  }


}
