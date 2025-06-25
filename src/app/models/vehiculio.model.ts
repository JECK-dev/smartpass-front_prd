export interface Vehiculo {
  idVehiculo: number;
  idContrato: number;
  placa: string;
  numTag: string;
  categoria: number;
  fechaCreacion: string;
  modelo: string;
  color: string;
  marca: string;
  idEstado: number;
  cliente: {
    idCliente: number; }
}