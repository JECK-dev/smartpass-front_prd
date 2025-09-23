// src/app/models/estado-cuenta.model.ts

export interface Movimiento {
  fecha: string;        // Ej: '2025-09-01'
  tipo: string;         // Ej: 'Recarga', 'Cruce Peaje'
  descripcion: string;  // Ej: 'Yape', 'Línea Amarilla'
  monto: number;        // Ej: 50 o -8
}

export interface EstadoCuenta {
  saldoInicial: number;
  cargos: number;
  abonos: number;
  saldoFinal: number;
  movimientos: Movimiento[];
}
