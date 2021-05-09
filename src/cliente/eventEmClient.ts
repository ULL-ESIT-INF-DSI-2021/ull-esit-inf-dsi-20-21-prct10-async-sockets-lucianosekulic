import { EventEmitter } from 'events';

/**
 * clase eventEmCLient, sirve para conectar el cliente al servidor
 */
export class EventEmClient extends EventEmitter  {
  /**
   * constructor de la clase
   * @param conectar 
   */
  constructor(conectar: EventEmitter) {
    super();

    let msj = '';

    conectar.on('data', (mensajeOn) => {
      msj = msj + mensajeOn;
    });
  
    conectar.on('end', () => {
      this.emit('mensaje', JSON.parse(msj));
    });
  }

 
}