// src/app/models/registro.model.ts

export interface Cliente {
  nombre: string;
  apellido: string;
  numDocumento: string;
  telefono: number;
  correo: string;
}

export interface Usuario {
  nombre: string;
  apellido: string;
  dni: string;
  numTelefono: number;
  usuario: string;
  password: string;
}

export interface RegistroRequest {
  cliente: Cliente;
  usuario: Usuario;
}
