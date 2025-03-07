import { knex } from "@/database/config";


/**
 * @description Consulta os dados da tabela atendimento_paciente_v
 * @returns {Promise<any[]>} - array de dados
 * @throws {Error} - erro ao executar a queryMain
 */
const queryMain = async (): Promise<any[]> => {

    const query = knex('tasy.atendimento_paciente_v as ap')
    .select(
        knex.raw('COUNT(tasy.nr_atendimento) AS Legado'),
        knex.raw('COUNT(api.nr_atendimento) AS API'),
        knex.raw('COUNT(tasy.nr_atendimento) - COUNT(api.nr_atendimento) AS DIFERENCA')
    )
    .leftJoin('tasy.sus_laudo_paciente as a', 'a.nr_atendimento', 'ap.nr_atendimento')
    .leftJoin('tbl_inm_atendimento as api', 'tasy.nr_atendimento', 'api.nr_atendimento')
    .where('a.dt_cancelamento', 'null')
    .andWhere('ie_tipo_atendimento', 1)
    .andWhere('cd_convenio', 4)
    .andWhereRaw('TRUNC(dt_alta) = TRUNC(SYSDATE - 1)') // Alteração para pegar o dia anterior
    .groupBy('tasy.nr_atendimento');

try {
    const result = await query;
    console.log(`Query executada com sucesso: ${JSON.stringify(result)}`);
    return result;
} catch (error) {
    console.error("Erro ao executar a query:", error);
    throw error;
}

}


/**
 * @description Trata os dados da tabela atendimento_paciente_v
 * @returns {Promise<string>} - string de dados
 * @throws {Error} - erro ao executar a queryTratamentoMain
 */
export const queryTratamentoMain = async (): Promise<string> => {
    
    const result = await queryMain();

    if(result.length === 0) {
        return "Nenhum resultado encontrado";
    }

    const tratamento = result[0];

    const {Legado, API, DIFERENCA} = tratamento;
    
    return `Legado: ${Legado}, API: ${API}, DIFERENCA: ${DIFERENCA}`
}
