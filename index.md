# Práctica 10 DSI

En esta práctica se ha creado un cliente y un servidor  haciendo uso de sockets para una aplicación de procesamiento de texto de la practica 8 de la asignatura. Se tiene que hacer uso y familiarizarse con el modulo net de node.js, con la clase EventMitter del modulo Events de node.js y utilizar los paquetes yargs y chalk de la practica8.

Requisitos:
* Permitir que multiples usuarios interactuen
* Nota formada por como minimo por titulo, cuerpo y color
* Cada usuario tendrá su lista de notas donde podrá añadir, modificar, eliminar, listar y leer

# Organización del repositorio

## Carpeta AppNotas
En esta carpeta incorporamos lo relacionado con la practica 8, sin embargo, añadimos lo siguiente en mainNote.ts:

```
 const client = connect({port: 60300});
 const clientEEC = new EventEmClient(client);

if (process.argv.length < 3) {
  console.log('No se especificaron correctamente los argumentos');
} 
else {
  const client = net.connect({port: 60300});
  const clientEEC = new EventEmClient(client);

  /**
   * Sirve parta manejar el evento de eventEmClient
   */
  clientEEC.on('mensaje', (msjRespuesta: ResponseType) => {

    switch (msjRespuesta.type) {
      case 'add':
        if (msjRespuesta.estado == true) {
          console.log(chalk.green('Se ha añadido una nueva nota'));
        } 
        else {
          console.log(chalk.red("error en añador la nota"));
        }
        break;

      case 'modify':
        if (msjRespuesta.estado == true) {
          if (msjRespuesta.modificar == "titulo") {
            console.log(chalk.green('titulo modificado'));
          }
        } 
        else {
          console.log(chalk.red("no se ha encontrado la nota"));
        }
        break;

      case 'remove':
        if (msjRespuesta.estado == true) {
          console.log(chalk.green('nota borrada'));
        } else {
          console.log(chalk.red("no se ha encontrado la nota"));
        }
        break;

      case 'list':
        console.log("Listado");
        if (msjRespuesta.notas == undefined || msjRespuesta.notas == []) {
          console.log(chalk.red(`error al listar`));
        } 
        else {
          msjRespuesta.notas.forEach((datos) => {
            switch (argv.color) {
              case "red":
                console.log(chalk.red(`${datos.titulo}`));
                break;
              case "green":
                console.log(chalk.green(`${datos.titulo}`));
                break;
              case "blue":
                console.log(chalk.blue(`${datos.titulo}`));
                break;
              case "yellow":
                console.log(chalk.yellow(`${datos.titulo}`));
                break;
              default:
                break;
            }
          });
        }
        console.log();
        break;

      case 'read':
        if (msjRespuesta.estado == true) {
          if (msjRespuesta.notas != undefined) {
            switch (msjRespuesta.notas[0].color) {
              case "red":
                console.log(chalk.red(`${msjRespuesta.notas[0].titulo}`));
                console.log(chalk.red(`${msjRespuesta.notas[0].cuerpo}`));
                break;
              case "green":
                console.log(chalk.green(`${msjRespuesta.notas[0].titulo}`));
                console.log(chalk.green(`${msjRespuesta.notas[0].cuerpo}`));
                break;
              case "blue":
                console.log(chalk.blue(`${msjRespuesta.notas[0].titulo}`));
                console.log(chalk.blue(`${msjRespuesta.notas[0].cuerpo}`));
                break;
              case "yellow":
                console.log(chalk.yellow(`${msjRespuesta.notas[0].titulo}`));
                console.log(chalk.yellow(`${msjRespuesta.notas[0].cuerpo}`));
                break;
              default:
                break;
            }
          }
        } else {
          console.log(chalk.red("No se puede leer"));
        }
        break;

      default:
        break;
    }
  });
  
  ```
  Estas líneas de codigo sirven para conectar al servidor por el puerto 60300 y creamos una variable clientEEC de tipo eventEmClient que es una clase que extiende a eventMitter. Esta clase esta expuesta por eventos para agreagr oyentes, elimianr oyentes, etc. Luego creamos un switch donde manejamos los eventos requeridos de eventEmClient que son los siguentes:
  * add: donde añadimos un autor
  * modify: mofificamos un titulo
  * remove: donde eliminamos una nota
  * list: lista los autores de las notas
  * read: lee las notas 

 ## carpeta de cliente
 
 En esta carpeta tenemos la clase eventEmClient, donde la creamos con la finalidad de conectar el client al servidor. Esta compuesta por un constructor que le pasamos un variable conectar de tipo eventMitter, dentro creamos una variable msj vacia y mediante conectar.on (agrega la funcion listener al final de la matriz de oyente para el evento) y le sumamos a msj la variable mensajeOn. Hacemos lo mismo para el "end" pero usamos un .emit para llamr de manera sincrona las escuchas registradas. Por ultimo usamos el JSON.parse para analizar una cadena de tipo JSON.
 
 ```
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
```

## Carpeta servidor

En esta carpeta tenemos todo lo relacionado con el servidor.
* archivo eventEmServer.ts
* * clase creada para conectar el servidor al cliente, pero usando el modulo net de node.js, que es una API de red asincrona para crear servidores y clientes de tcp o ipc basados en flujo

```
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

```

* Archivo server.ts
* * Sirve para manejar la clase eventEmServer al usar el evento. En primer lugar utilizamos el emitter.on, que es una funcion que agrega el listener al final de la matriz de oyentes del evento. Luego creamos varias constantes donde guardamos los objetos add, modify, remove, list y read. Despues hacemos un switch con lo mismo dicho anteriormente y hacemos lo siguiente:
* add: comprobamso si hay un autor, en caso afirmativo llamamos a addAutor y creamos el autor, luego prcesamos la respuesta server
* modify: comprobamos si el titulo de la nota es un string, en caso afirmativo modificamos mediante existeNota el titulo de la misma y luego procesamos la respuesta del server
* remove: comprobamos si el autor no es null, en caso afirmativo llamamos a la funcion existeNota de remove y eliminamos el titulo de la nota.
* list: Llamamos a existeNota de la funcion list y listamos los autores de la nota, luego procesamos la respuesta del server
* read: comprobamos si el userRead no es null, en caso afirmativo llamamos a exiteNota de la clase read y si no está vacio, leemos el titulo de las notas.

Por ultimo usamos el conectar.on de "close" para manejar el evento de close del socket para desconectarse del cliente y server.listen donde escuchamos al puerto y esperamos a que se conecten los clientes

```

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

```
Por ultimo tenemos una archivo llamado type.ts donde creamos dos tipos de dato, el requestType y responseType

```
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
```
