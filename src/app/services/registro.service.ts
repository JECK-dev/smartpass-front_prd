// src/app/services/registro.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroRequest } from '../models/registro.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})  
export class RegistroService {
  private apiUrl = `${environment.apiUrl}/registro`;

  constructor(private http: HttpClient) {}

  registrarIndividual(data: RegistroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/individual`, data);
  }

  registrarEmpresa(data: RegistroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/empresa`, data);
  }
}
