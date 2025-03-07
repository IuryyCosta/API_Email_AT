import { knex as setupKnex } from "knex";


/**
 * @description Conecta ao banco de dados Oracle
 * @param host - host do banco de dados
 * @param user - usuário do banco de dados
 * @param password - senha do usuário
 * @param database - nome do banco de dados
 * @returns {Promise<string>} - mensagem de conexão com o banco de dados
 * @throws {Error} - erro ao conectar ao banco de dados
 */
export const getOracleConnection = async (host:string, user:string , password:string, database:string) => {

try {
    // Criando uma nova instância do knex com a configuração do Oracle
    const oracleKnex = setupKnex({
        client: "oracledb",
        connection: {
            host,
            user,
            password,
            database,
            
        }
    });

    
    const result = await oracleKnex.raw("SELECT 1 FROM DUAL");
    return `Conexão com Oracle estabelecida com sucesso: ${	result}`;
} catch (error) {
    console.error("Erro ao conectar ao Oracle:", error);
    throw error;
}


}
