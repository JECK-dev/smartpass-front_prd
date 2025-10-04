import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  token: string = '';
  password: string = '';
  confirmPassword: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtenemos el token desde la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  cambiarPassword(): void {
    if (this.password !== this.confirmPassword) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    this.cargando = true;
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (res) => {
        this.mensaje = 'Contraseña actualizada correctamente. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.mensaje = 'Error: ' + (err.error?.message || 'No se pudo cambiar la contraseña');
        this.cargando = false;
      }
    });
  }
}
