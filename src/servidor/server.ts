import { EventEmServer } from './eventEmServer';
import * as net from 'net';
import { ResponseType } from '../type';
import { Add } from '../appNotas/add';
import EventEmitter = require('events');
import { Modify } from '../appNotas/modify';
import { Remove } from '../appNotas/remove';
import { List } from '../appNotas/list';
import { Read } from '../appNotas/read';

const server = net.createServer((conectar) => {
  console.log('Cliente conectado');

  const emitter = new EventEmServer(conectar);

  let aux: number = 1;

  /**
   * Sirve para manejar el eventEmServer al usar el evento request
   */
  emitter.on('request', (mensaje) => {
    let msjRespuesta: ResponseType;
  
    
    const user = new Add(mensaje.autor, mensaje.titulo, mensaje.cuerpo, mensaje.color);
    const userModify = new Modify(mensaje.autor, mensaje.titulo, mensaje.cuerpo, mensaje.color);
    const userRemove = new Remove(mensaje.autor, mensaje.titulo);
    const userList = new List(mensaje.autor);
    const userRead = new Read(mensaje.autor, mensaje.titulo);

    switch (mensaje.type) {
        
      case 'add':
        if(user.addAutor != null) {
            user.addAutor(mensaje.autor);
        }
        
        msjRespuesta = {
          type: 'add',
          estado: true,
        };

        conectar.write(`${JSON.stringify(msjRespuesta)}`, () => {
          if (msjRespuesta.estado == true) {
            console.log(`Proceso el  "${msjRespuesta.type}" del cliente y se envío correctamente al cliente el mensaje`);
          } 
          else {
            console.log(`No se pudo procesar la "${msjRespuesta.type}" del cliente`);
          }
          conectar.end();
        });

        break;

      case 'modify':
        let auxExit = '';

        if (typeof mensaje.titulo === 'string') {
          userModify.existeNota(mensaje.titulo);

          msjRespuesta = {
            type: 'modify',
            estado: true,
            modificar: 'titulo',
          };

          auxExit = JSON.stringify(msjRespuesta);
        }

        conectar.write(`${auxExit}\n`, () => {
          if (msjRespuesta.estado == true) {
            console.log(`Se proceso correctamente la "${msjRespuesta.type}" del cliente`);
          } 
          else {
            console.log(`No se pudo procesar bien la "${msjRespuesta.type}" del cliente`);
          }
          conectar.end();
        });
        break;

      case 'remove':
          if(mensaje.autor != null) {
            userRemove.existeNota(mensaje.titulo);
          }

        msjRespuesta = {
          type: 'remove',
          estado: true,
        };

        conectar.write(`${JSON.stringify(msjRespuesta)}\n`, () => {
          if (msjRespuesta.estado == true) {
            console.log(`Se proceso bien la "${msjRespuesta.type}" del cliente`);
          }
           else {
            console.log(`No se pudo procesar bien la "${msjRespuesta.type}" del cliente`);
          }
          conectar.end();
        });
        break;

      case 'list':
        userList.existeNota();

        msjRespuesta = {
          type: 'list',
          estado: true,
          notas: [],
        };

        conectar.write(`${JSON.stringify(msjRespuesta)}\n`, () => {
          if (msjRespuesta.estado == true) {
            console.log(`Se proceso bien la "${msjRespuesta.type}" del cliente`);
          } 
          else {
            console.log(`No se pudo procesar bien la "${msjRespuesta.type}" del cliente`);
          }
          conectar.end();
        });
        break;

      case 'read':
          if(userRead != null) {
            userRead.existeNota(mensaje.titulo);
            if(userRead.existeNota(mensaje.titulo) != 1) {
                userRead.tituloNota();
            }
            else {
                console.log(`No existe ${mensaje.titulo}`)
            }
            
          }

        msjRespuesta = {
          type: 'read',
          estado: true
        };

        conectar.write(`${JSON.stringify(msjRespuesta)}\n`, () => {
          if (msjRespuesta.estado == true) {
            console.log(`Se proceso bien la "${msjRespuesta.type}" del cliente`);
          } 
          else {
            console.log(`No se pudo procesar bien la "${msjRespuesta.type}" del cliente`);
          }
          conectar.end();
        });
        break;

      default:
        break;
    }
  });

  /**
   * Se utiliza para manejar el socket al hacer el evento close, que es al desconectarse un determinado cliente
   */
  conectar.on('close', () => {
    console.log('El cliente se desconecto');
  });
});

/**
 * El server escucha en el puerto 60300
 */
server.listen(60300, () => {
  console.log('Esperando a que se conecten los clientes');
});