import { knex as setupKnex } from "knex";
import { env } from "@/schemas";
import oracledb from 'oracledb';

// Configurar o modo THICK (completo) em vez do modo THIN
oracledb.initOracleClient({ libDir: env.ORACLE_LIB_DIR });

const config = {
    client: "oracledb",
    connection: {
        user: env.ORACLE_USER,
        password: env.ORACLE_PASSWORD,
        connectString: env.ORACLE_CONNECT_STRING,
        // Configurações específicas do Oracle
        privilege: oracledb.SYSDBA,
        // Forçar o uso do modo THICK
        thin: false
    },
    pool: {
        min: 2,
        max: 10
    }
};

export const knex = setupKnex(config);
