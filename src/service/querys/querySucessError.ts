import { knex } from "@/database/config";


/**
 * @description Consulta os sucessos e erros do banco de dados Oracle
 * @returns {Promise<string>} - string de sucessos e erros
 * @throws {Error} - erro ao executar a querySucessError
 */
const querySucessError = async (): Promise<any[]> => {
    try {
        // Consulta SQL
        const query = knex.raw(`
            SELECT 
                S.SUCESSO,
                E.ERROS
            FROM 
                (SELECT DISTINCT 
                    COUNT(TP_STATUS) AS SUCESSO,
                    TP_STATUS    
                FROM 
                    TBL_INM_ATENDIMENTO 
                WHERE 
                    TRUNC(TO_DATE(DT_ALTA, 'DD/MM/YYYY HH24:MI:SS')) = TRUNC(SYSDATE - 1)
                    AND TP_STATUS IN ('T')
                GROUP BY TP_STATUS) S,
                (SELECT DISTINCT 
                    COUNT(TP_STATUS) AS ERROS,
                    TP_STATUS    
                FROM 
                    TBL_INM_ATENDIMENTO 
                WHERE 
                    TRUNC(TO_DATE(DT_ALTA, 'DD/MM/YYYY HH24:MI:SS')) = TRUNC(SYSDATE - 1)
                    AND TP_STATUS IN ('E')
                GROUP BY TP_STATUS) E
            WHERE 1 = 1
        `);

        // Resultado da query
        const result = await knex.raw(query);
        return result.rows;

    } catch (error) {
        console.error("Erro ao executar a querySucessoError:", error);
        throw error;
    }
};

/**
 * @description Trata os sucessos e erros do banco de dados Oracle
 * @returns {Promise<string>} - string de sucessos e erros
 * @throws {Error} - erro ao executar a queryTratamentoSucessError
 */
export const queryTratamentoSucessError = async (): Promise<string> => {
    try {
        // Chama a função que executa a consulta SQL
        const result = await querySucessError();

        // Verifica se o resultado está vazio ou não é um array válido
        if (!Array.isArray(result) || result.length === 0) {
            return "Nenhum resultado encontrado Consulta Sucesso/Erro";
        }

        // Desestrutura o resultado
        const { SUCESSO, ERROS } = result[0];

        // Retorna o resultado formatado
        return `Sucessos: ${SUCESSO}, Erros: ${ERROS}`;

    } catch (error) {
        console.error("Erro ao executar a queryTratamentoSucessError:", error);
        throw error;
    }
};