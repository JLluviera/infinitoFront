import { Asiento } from "./asiento.model";

export interface PlantillaVehiculo{
    id: number;
    nombrePlantilla: string;
    totalPisos: number;
    totalFilas: number;
    totalColumnas: number;
    asientos: Asiento[];
}