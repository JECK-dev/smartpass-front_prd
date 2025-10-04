import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LoginPayload {
  usuario: string;      // en tu form lo mapeamos desde "documento"
  password: string;
}

export interface LoginResponse {
  message?: string;
  idUsuario: number;
  idCliente: number;
  idRol: number;
  nombre?: string;
  apellido?: string;
  token?: string;       // por si luego agregas JWT
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Si tienes environment, usa environment.apiUrl; si no, deja esta constante:
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap(res => this.setSession(res)),
      catchError(err => {
        // Mensaje uniforme
        const msg = err?.error || 'Credenciales inválidas';
        return throwError(() => msg);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password`, { token, password });
  }

  // ===== helpers de sesión =====
  setSession(res: LoginResponse): void {
    // Guarda lo que ya vienes usando
    localStorage.setItem('idCliente', String(res.idCliente));
    localStorage.setItem('idUsuario', String(res.idUsuario));
    localStorage.setItem('idrol', String(res.idRol));

    const nombreUsuario = (res.nombre && res.apellido)
      ? `${res.nombre} ${res.apellido}`
      : 'Usuario';
    localStorage.setItem('nombreUsuario', nombreUsuario);

    if (res.token) {
      localStorage.setItem('token', res.token);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('idCliente');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('idrol');
    localStorage.removeItem('nombreUsuario');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
