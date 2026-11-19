/**
 * Nombres de respaldo guardados en el proyecto (ids secuenciales, los
 * mismos negocios sembrados en el backend local). El nombre que se
 * muestra en el encabezado del panel sale de la respuesta de la API
 * cuando la consulta funciona; estos nombres solo llenan el selector
 * cuando el servicio no se puede consultar.
 */
export interface EmpresaDemo {
  id: number;
  nombre: string;
}

export const EMPRESAS_DEMO: readonly EmpresaDemo[] = [
  { id: 1, nombre: "Minimarket Don Lucho" },
  { id: 2, nombre: "Café Rincón Andino" },
  { id: 3, nombre: "Peluquería Estilo Sur" },
  { id: 4, nombre: "Cosmos Accesorios" },
];
