import { knex } from "@/database/config";


/**
 * @description Consulta os dados da tabela atendimento_paciente_v
 * @returns {Promise<any[]>} - array de dados
 * @throws {Error} - erro ao executar a queryMain
 */


export const queryMain = async (): Promise<any[]> => {
    const query = `
    SELECT 
        COUNT(mv.nr_atendimento) AS LEGADO,
        COUNT(api.nr_atendimento) AS API,
        COUNT(mv.nr_atendimento) - COUNT(api.nr_atendimento) AS DIFERENCA
    FROM (
        -- Subconsulta para obter o total de atendimentos de alta no dia anterior do sistema MV
        SELECT DISTINCT 
            atendime.cd_atendimento AS nr_atendimento
        FROM 
            dbamv.atendime
        WHERE   
            tp_atendimento = 'I'
            AND cd_convenio = 1
            AND dt_alta IS NOT NULL
            AND TRUNC(dt_alta) = TRUNC(SYSDATE - 1) -- Alteração para pegar o dia anterior
    ) mv
    LEFT JOIN (
        -- Total de atendimentos na tabela tbl_inm_atendimento para o dia anterior
        SELECT DISTINCT 
            nr_atendimento
        FROM 
            tbl_inm_atendimento
        WHERE 
            TP_STATUS <> 'A'
            AND nr_atendimento IN (
                SELECT DISTINCT 
                    atendime.cd_atendimento AS nr_atendimento
                FROM 
                    dbamv.atendime
                WHERE   
                    tp_atendimento = 'I'
                    AND cd_convenio = 1
                    AND dt_alta IS NOT NULL
                    AND TRUNC(dt_alta) = TRUNC(SYSDATE - 1) -- Alteração para pegar o dia anterior
            )
    ) api 
    ON mv.nr_atendimento = api.nr_atendimento
    `;

    // Execute the query using knex.raw()
    const result = await knex.raw(query);

    return result.rows;
};


export const queryTratamentoMain = async (): Promise<string> => {
    try {
        const result = await queryMain(); // Chama a função que executa a consulta SQL

        // Verifica se não há resultados
        if (result.length === 0) {
            return "Nenhum resultado encontrado";
        }

        // Extrai os valores de LEGADO, API e DIFERENCA
        const { LEGADO, API, DIFERENCA } = result[0];

        // Retorna o resultado formatado
        return `Legado: ${LEGADO}, API: ${API}, DIFERENCA: ${DIFERENCA}`;

    } catch (error) {
        console.error("Erro ao executar a queryTratamentoMain:", error);
        throw error;
    }
};