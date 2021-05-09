/**
 * tipo de dato para el request
 */
export type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'list' | 'read';
    autor: string;
    titulo?: string;
    cuerpo?: string;
    color?: string;
  }
  
  /**
   * Tipo de dato para las respuestas
   */
  export type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'list' | 'read';
    estado: boolean;
    notas?: {
        titulo: string;
        cuerpo: string;
        color: string;
    }[];
    modificar?: string;
}