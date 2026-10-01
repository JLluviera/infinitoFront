export interface Auditoria {
  id: number;
  nombreEntidad: string;
  accion: string;
  clavePrimaria: string | null;
  cambios: string | null;
  usuarioId: number | null;
  mailUsuario: string | null;
  direccionIp: string | null;
  timestamp: string;
}