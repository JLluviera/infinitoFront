import { AsientoMapaDTO } from "./AsientoMapaDTO";
import { PasajeroPendienteDTO } from "./pasajeroPendienteDTO";

export interface MapaExcursionResponseDTO
{
    excursionId: number,
    nombreExcursion: string,
    plantillaVehiculoId: number, 
    nombrePlantilla: string,
    totalPisos: number,
    totalFilas: number,
    totalColumnas: number,
    asientos: AsientoMapaDTO[];
    pasajerosPendientes: PasajeroPendienteDTO[]
}