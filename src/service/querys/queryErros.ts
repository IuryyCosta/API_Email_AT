import { knex } from "@/database/config";


/**
 * @description Consulta os erros do banco de dados Oracle
 * @returns {Promise<any[]>} - array de erros
 * @throws {Error} - erro ao executar a queryErros
 */
const queryErros = async (): Promise<any[]> => {

    try{
        const query = knex('TBL_INM_ATENDIMENTO')
        .select(
            knex.raw('DISTINCT DS_ERRO AS DS_ERRO_COUNT'),
            knex.raw('DS_ERRO')
        ).distinct('DS_ERRO')
        .whereRaw("trunc(DT_PROCESSADO) = trunc(sysdate - 1)")
        .andWhere("DS_ERRO","<>","NULL")
        .groupBy('DS_ERRO');

        const result = await query;
        console.log(`Query executada com sucesso: ${JSON.stringify(result)}`);
        return result;

    }catch(queryErros){
        console.error("Erro ao executar a queryErros:", queryErros);
        throw queryErros;
    }
}


/**
 * @description Trata os erros do banco de dados Oracle
 * @returns {Promise<string>} - string de erros
 * @throws {Error} - erro ao executar a queryTratamentoErros
 */
export const queryTratamentoErros = async (): Promise<string> => {

    const result = await queryErros();

    if(!Array.isArray(result) || result.length === 0) {
         console.log( "Nenhum resultado encontrado Consulta Erros");
    }

    const tratamento = result.map(
        (result:{DS_ERRO:string, DS_ERRO_COUNT:string}) => {
            return `Erro: ${result.DS_ERRO}, Quantidade: ${result.DS_ERRO_COUNT}`
        }
    )

    return tratamento.join("\n");
    
}

