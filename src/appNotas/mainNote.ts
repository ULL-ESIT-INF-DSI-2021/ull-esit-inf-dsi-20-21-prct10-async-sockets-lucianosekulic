import { Add } from './add';
import { List } from './list';
import { Modify } from './modify';
import { Read } from './read';
import { Remove } from './remove';
const yargs = require('yargs');
const chalk = require('chalk');

import { RequestType, ResponseType} from '../type';
import * as net from 'net';
import { connect } from 'net';
import { EventEmClient} from '../cliente/eventEmClient';


/**
 * requerido para conectar al servidor
 */
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


/**
 * Archivo donde gestionamos los diferentes comandos, con sus comandos, haciendo uso de yargs.
 */

/**
 * Comando: --add: Añadir una nota.
 * ejemplo: --autor="nombre autor" --titulo="titulo de la nota" --cuerpo="cuerpo de la nota" --color="color de la nota"
 */
yargs.command("add", 'Añadir una nota', {
    autor: {
        describe: 'Autor',
        demandOption: true,
        type: 'string',
    },
    titulo: {
        describe: 'Titulo',
        demandOption: true,
        type: 'string',
    },
    cuerpo: {
        describe: 'Cuerpo de la nota',
        demandOption: true,
        type: 'string',
    },
    color: {
        describe: 'Color',
        demandOption: true,
        type: 'string',
    },
});


/**
 * Comando: --list: Hace un listado de las notas del autor.
 * ejemplo: --autor="nombre autor"
 */
yargs.command("list", "Lista de las notas", {
    autor: {
        describe: 'Autor',
        demandOption: true,
        type: 'string',
    }
});


/**
 * Comando --read: Lee una nota con su respectivo titulo.
 * ejemplo: --autor="nombre autor" --titulo="titulo de la nota"
 */
yargs.command("read", "Lee una nota", {
    autor: {
        describe: 'Autor de la nota que se va a leer',
        demandOption: true,
        type: 'string',
    },
    titulo: {
        describe: 'Titulo de la nota que se va a leer',
        demandOption: true,
        type: 'string',
    },
});


/**
 * Comando --remove: Borra la nota de un autor con su respectivo titulo.
 * ejemplo: --autor="nombre autor" --titulo="titulo de la nota"
 */
yargs.command("remove", "Borrar una nota", {
    autor: {
        describe: 'Autor de la nota que se va a borrar',
        demandOption: true,
        type: 'string',
    },
    titulo: {
        describe: 'Titulo de la nota que se va a borrar',
        demandOption: true,
        type: 'string',
    },
});


/**
 * Comando --modify: Modifica una nota.
 * ejemplo: --autor="nombre autor" --titulo="titulo de la nota" --cuerpo="cuerpo de la nota" --color="color de la nota"
 */
 yargs.command("modify", 'Modificar una nota', {
    autor: {
        describe: 'Autor',
        demandOption: true,
        type: 'string',
    },
    titulo: {
        describe: 'Titulo',
        demandOption: true,
        type: 'string',
    },
    cuerpo: {
        describe: 'Cuerpo',
        demandOption: true,
        type: 'string',
    },
    color: {
        describe: 'Color',
        demandOption: true,
        type: 'string',
    },
});


const argv = yargs.argv;
const comando = argv._[0];


if (comando == "add"){
    new Add(argv.autor, argv.titulo, argv.cuerpo, argv.color);
}
else if (comando == "list"){
    new List(argv.autor);
}
else if (comando == "read"){
    new Read(argv.autor, argv.titulo);
}
else if (comando == "remove"){
    new Remove(argv.autor, argv.titulo);
}
else if (comando == "modify"){
    new Modify(argv.autor, argv.titulo, argv.cuerpo, argv.color);
}
else{
  console.log(chalk.red(`Error 400, no existe el comando`));
}

yargs.parse();
}