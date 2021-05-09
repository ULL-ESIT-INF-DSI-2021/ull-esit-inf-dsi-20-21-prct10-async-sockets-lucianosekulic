import { EventEmitter } from 'events';
import * as net from 'net';


/**
 * clase eventEmServer, sirve para conectar el cliente al servidor 
 */
export class EventEmServer extends EventEmitter {
  private servidor: net.Server;

  /**
   * constructor de la clase 
   * @param conectar 
   */
  constructor(conectar: EventEmitter) {
    super();
    let msj = '';

    conectar.on('data', (mensajeOn) => {
      msj += mensajeOn;
      let mensajeLim = msj.indexOf('\n');
      while (mensajeLim !== -1) {
        const message = msj.substring(0, mensajeLim);
        msj = msj.substring(mensajeLim + 1);
        this.emit('request', JSON.parse(message));
        mensajeLim = msj.indexOf('\n');
      }
    });
  }
}