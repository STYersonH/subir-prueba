// para interactuar con la base de datos
import { PrismaClient } from "@prisma/client";


declare global {
    // prisma almacena la instancia de PrismaClient para que no se cree cada vez que se importa el módulo
    var prisma: PrismaClient | undefined ;
}

// globalThis es una variable global que se puede acceder desde cualquier lugar para acceder a la instancia global de PrismaClient
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV === "production") globalThis.prisma = client;

export default client;