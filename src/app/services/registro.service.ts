// src/app/services/registro.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroRequest } from '../models/registro.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})  
export class RegistroService {
  private apiUrl = 'http://localhost:8080/api/registro';

  constructor(private http: HttpClient) {}

  registrarIndividual(data: RegistroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/individual`, data);
  }

  registrarEmpresa(data: RegistroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/empresa`, data);
  }
}
