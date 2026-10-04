import { CrearAsientoDto } from "./crearAsientoDto";

export interface CrearPlantillaVehiculoDto {
  nombrePlantilla: string;
  totalPisos: number;
  totalFilas: number;
  totalColumnas: number;
  asientos: CrearAsientoDto[];
}