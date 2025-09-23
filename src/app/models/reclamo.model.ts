export interface Reclamo {
  idReclamo: number;
  idCliente: number;
  idVehiculo: number;
  idTipoReclamo: number;
  detalle: string;
  estado: number; // 1=Abierto, 2=En proceso, 3=Cerrado
  fechaCreacion: string;   // formato ISO
  fechaResolucion?: string;
  respuesta?: string;
}
