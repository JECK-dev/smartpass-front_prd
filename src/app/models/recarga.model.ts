export interface RecargaRequest {
  idContrato: number;
  monto: number;
  medioPago: number;
  descripcion: string;
}

export interface Contrato {
  idContrato: number;
  nroContrato: string;
  idCliente: number;
}

export interface TransaccionSaldo {
  fecha: string;
  tipoTransaccion: string;
  monto: number;
  saldoFinal: number;
  descripcion: string;
}
