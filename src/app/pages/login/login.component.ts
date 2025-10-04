import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

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
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      documento: ['', Validators.required], // tu input visible
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formLogin.invalid) {
      this.mensajeError = 'Debe completar todos los campos.';
      return;
    }

    this.mensajeError = '';
    this.cargando = true;

    // Mapear documento -> usuario (el back espera "usuario")
    const credenciales = {
      usuario: this.formLogin.value.documento.trim(),
      password: this.formLogin.value.password
    };

    console.log("📤 Enviando credenciales al backend:", credenciales);

    this.authService.login(credenciales).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.mensajeError = err?.error || 'Credenciales inválidas o usuario no registrado.';
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

}