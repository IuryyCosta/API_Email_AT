import { knex } from "@/database/config";


const queryErros = async (): Promise<any[]> => {
    try {
        // Consulta SQL diretamente
        const query = `
            SELECT DISTINCT 
                COUNT(DS_ERRO) AS DS_ERRO_COUNT,
                DS_ERRO 
            FROM TBL_INM_ATENDIMENTO 
            WHERE 
                TRUNC(DT_PROCESSADO) = TRUNC(SYSDATE - 1)
                AND DS_ERRO <> 'NULL'
            GROUP BY DS_ERRO
        `;
        
        // Executando a consulta SQL com knex.raw()
        const result = await knex.raw(query);
        
        console.log(`Query executada com sucesso: ${JSON.stringify(result)}`);
        
        // Verificando se o retorno tem a propriedade rows (depende do banco de dados e do knex configurado)
        return result.rows || result;  // Retorna o resultado
    } catch (queryErros) {
        console.error("Erro ao executar a queryErros:", queryErros);
        throw queryErros;
    }
};


export const queryTratamentoErros = async (): Promise<string> => {
    const result = await queryErros();

    // Verificando se o resultado é um array e contém dados
    if (!Array.isArray(result) || result.length === 0) {
        return "Nenhum resultado encontrado na Consulta Erros";
    }

    // Formatação dos resultados
    const tratamento = result.map(
        (item: { DS_ERRO: string; DS_ERRO_COUNT: string }) => {
            return `Erro: ${item.DS_ERRO}, Quantidade: ${item.DS_ERRO_COUNT}`;
        }
    );

    // Retorna a lista formatada
    return tratamento.join("\n");
};
