export interface Pipican {
  _id: string;
  name?: string; 
  barrio?: string;
  coords: [number, number]; // Coordenadas [longitud, latitud]
}
