export interface PasajeroPendienteDTO {
  reservaClienteId: number;
  nombreCliente: string;
  documento?: string;
  asientoAsignadoId?: number | null;
}