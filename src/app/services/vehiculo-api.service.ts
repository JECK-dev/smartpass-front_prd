import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculoApiService {
  private apiBase = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  constructor(private http: HttpClient) {}

  getMarcas(): Observable<string[]> {
    return this.http.get<any>(`${this.apiBase}/getallmakes?format=json`).pipe(
      map(response => response.Results.map((item: any) => item.Make_Name))
    );
  }

  getModelosPorMarca(marca: string): Observable<string[]> {
    return this.http.get<any>(`${this.apiBase}/getmodelsformake/${marca}?format=json`).pipe(
      map(response => response.Results.map((item: any) => item.Model_Name))
    );
  }
}
