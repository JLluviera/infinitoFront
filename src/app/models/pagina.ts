export interface Pagina<T> {
  elementos: T[];
  siguienteCursor: number | null;
  hayMas: boolean;
}
