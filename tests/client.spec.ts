import 'mocha';
import { expect } from 'chai';
import { EventEmitter } from 'events';
import { EventEmClient } from '../src/cliente/eventEmClient';
import { ResponseType } from '../src/type';

describe('Prueba de EventEmClient', ()=> {
  it('Emision de evento', ()=>{
    const socket = new EventEmitter();
    const client = new EventEmClient(socket);
    const nota = {
      titulo: "Nota",
      cuerpo: "Nota de color amarillo",
      color: "yellow",
    };

    client.on('mensaje', (pregunta: ResponseType) => {
      expect(pregunta.type).to.be.equal("read");
      expect(pregunta.estado).to.be.equal("true");
      expect(pregunta.modificar).to.be.equal("titulo");
    });

    socket.emit('data', '("type": "read", ');
    socket.emit('data', `"estado": "true", "notas": (${JSON.stringify(nota)}), `);
    socket.emit('data', `"modificar": "titulo")`);
    socket.emit('end');
  });
});