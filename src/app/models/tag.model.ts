export interface Tag {
  numTag: number;
  disponible: boolean;
  fechaRegistro: string;
  fechaAsignacion?: string;
  plaza?: {
    numPlaza: number;
    nombre: string;
  };
}