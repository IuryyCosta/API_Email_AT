import { knex as setupKnex } from "knex";
import oracledb from 'oracledb';


/**
 * @description Conecta ao banco de dados Oracle
 * @param host - host do banco de dados
 * @param user - usuário do banco de dados
 * @param password - senha do usuário
 * @param database - nome do banco de dados
 * @param connectString - string de conexão do banco de dados
 * @returns {Promise<string>} - mensagem de conexão com o banco de dados
 * @throws {Error} - erro ao conectar ao banco de dados
 */
export const getOracleConnection = async (
    host: string,
    user: string,
    password: string,
    database: string,
    connectString: string
) => {
    try {
        // Inicializa o cliente Oracle com o diretório do Instant Client
        oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB_DIR });

        const oracleKnex = setupKnex({
            client: "oracledb",
            connection: {
                host,
                user,
                password,
                database,
                connectString,
            },
            pool: {
                min: 2,
                max: 10,
                createTimeoutMillis: 3000,
                acquireTimeoutMillis: 30000,
                idleTimeoutMillis: 30000
            }
        });

        const result = await oracleKnex.raw("SELECT 1 FROM DUAL");
        return `Conexão com Oracle estabelecida com sucesso: ${result}`;
    } catch (error) {
        console.error("Erro ao conectar ao Oracle:", error);
        throw error;
    }
}
