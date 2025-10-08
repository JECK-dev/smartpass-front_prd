import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment'; // ✅ Import correcto

export interface UserSettings {
  notifCorreo: boolean;
  notifTelefono: boolean;
  idioma: 'es' | 'en' | string;
  modoOscuro: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private baseConfig = `${environment.apiUrl}/configuracion`; // ✅ Endpoint dinámico según entorno
  private baseUsuarios = `${environment.apiUrl}/usuarios`;    // ✅ También dinámico
  private localKey = 'sp_cfg';

  constructor(private http: HttpClient) {}

  /** Devuelve el id de usuario. Si no existe, usa 1 (modo desarrollo). */
  getUsuarioId(): number {
    const raw =
      localStorage.getItem('idusuario') ||
      localStorage.getItem('idUsuario') ||
      localStorage.getItem('idcliente');
    const n = Number(raw);
    return Number.isFinite(n) ? n : 1;
  }

  /** Carga preferencias desde backend; si falla, usa localStorage o defaults. */
  cargarPreferencias(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.baseConfig).pipe(
      catchError(() => {
        const local = localStorage.getItem(this.localKey);
        if (local) return of(JSON.parse(local) as UserSettings);
        return of<UserSettings>({
          notifCorreo: false,
          notifTelefono: false,
          idioma: 'es',
          modoOscuro: false
        });
      })
    );
  }

  /** Guarda preferencias en backend; si falla, persiste localmente para no perder cambios. */
  guardarPreferencias(s: UserSettings): Observable<UserSettings> {
    return this.http.put<UserSettings>(this.baseConfig, s).pipe(
      tap((val) => localStorage.setItem(this.localKey, JSON.stringify(val))),
      catchError(() => {
        localStorage.setItem(this.localKey, JSON.stringify(s));
        return of(s);
      })
    );
  }

  /** Cambio de contraseña: POST /api/usuarios/{id}/password */
  cambiarPassword(idUsuario: number, actual: string, nueva: string, confirmar: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUsuarios}/${idUsuario}/password`,
      { actual, nueva, confirmar }
    );
  }
}
