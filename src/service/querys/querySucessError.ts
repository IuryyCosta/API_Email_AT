import { knex } from "@/database/config";


/**
 * @description Consulta os sucessos e erros do banco de dados Oracle
 * @returns {Promise<string>} - string de sucessos e erros
 * @throws {Error} - erro ao executar a querySucessError
 */
const querySucessError = async (): Promise<string> => {
    try {
        const query = knex
            .select(
                knex.raw('S.SUCESSOS'),
                knex.raw('E.ERROS')
            )
            .from(
                knex
                    .select(knex.raw('COUNT(TP_STATUS) AS SUCESSO'))
                    .from('TBL_INM_ATENDIMENTO')
                    .whereRaw("TRUNC(TO_DATE(DT_ALTA, 'DD/MM/YYYY HH24:MI:SS')) = TRUNC(SYSDATE - 1)")
                    .andWhere('TP_STATUS', 'T')
                    .groupBy('TP_STATUS')
                    .as('S')
            )
            .join(
                knex
                    .select(knex.raw('COUNT(TP_STATUS) AS ERROS'))
                    .from('TBL_INM_ATENDIMENTO')
                    .whereRaw("TRUNC(TO_DATE(DT_ALTA, 'DD/MM/YYYY HH24:MI:SS')) = TRUNC(SYSDATE - 1)")
                    .andWhere('TP_STATUS', 'E')
                    .groupBy('TP_STATUS')
                    .as('E'),
                knex.raw('1=1') 
            );


        const result = await query;
        console.log(`Query executada com sucesso: ${JSON.stringify(result)}`);
        return JSON.stringify(result); 

    } catch (error) {
        console.error("Erro ao executar a querySucessoError:", error);
        throw error;
    }
}


/**
 * @description Trata os sucessos e erros do banco de dados Oracle
 * @returns {Promise<string>} - string de sucessos e erros
 * @throws {Error} - erro ao executar a queryTratamentoSucessError
 */
export const queryTratamentoSucessError = async (): Promise<string> => {
    
    const result = await querySucessError();

    if(!Array.isArray(result) || result.length === 0) {
        return "Nenhum resultado encontrado Consulta Sucesso/Erro";
    }

    const tratamento = result[0];
    const {SUCESSOS, ERROS} = tratamento;

    return `Sucessos: ${SUCESSOS}, Erros: ${ERROS}`
    
}
