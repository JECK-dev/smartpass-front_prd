import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, // MUY IMPORTANTE
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], //estaba mal escrito como styleUrl
  imports: [
    CommonModule,
    ReactiveFormsModule, // para que funcione formGroup y formControlName
    RouterLink
  ]
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      documento: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formLogin.invalid) {
      this.mensajeError = 'Debe completar todos los campos.';
      return;
    }

    const datosLogin = {
      documento: this.formLogin.value.documento.trim(),
      password: this.formLogin.value.password
    };

    this.http.post<any>('http://localhost:8080/api/auth/login', datosLogin).subscribe({
      next: (respuesta) => {
        // Guardar info útil en localStorage
        localStorage.setItem('idCliente', respuesta.idCliente);
        localStorage.setItem('idUsuario', respuesta.idUsuario);
        localStorage.setItem('nombreUsuario', respuesta.nombre + ' ' + respuesta.apellido);
        localStorage.setItem('idrol', respuesta.idRol);

        // Redirigir a contratos
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.mensajeError = 'Credenciales inválidas o usuario no registrado.';
      }
    });
  }
}