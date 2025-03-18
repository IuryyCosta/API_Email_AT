import { knex } from "@/database/config";



export const querySucessError = async () => {
    try{
        // Consulta SQL
        const query = `
        SELECT 
      S.SUCESSO,
      E.ERROS
  FROM 
      (SELECT DISTINCT 
              COUNT(TP_STATUS) SUCESSO,
              TP_STATUS    
          FROM 
              TBL_INM_ATENDIMENTO 
          WHERE 
                TRUNC(TO_DATE(DT_ALTA, 'DD/MM/YYYY HH24:MI:SS')) = TRUNC(SYSDATE - 1)
                AND TP_STATUS IN ('T')
          GROUP BY  TP_STATUS) S,
          (SELECT DISTINCT 
              COUNT(TP_STATUS)ERROS,
              TP_STATUS    
          FROM 
              TBL_INM_ATENDIMENTO 
          WHERE 
                TRUNC(TO_DATE(DT_ALTA, 'DD/MM/YYYY HH24:MI:SS')) = TRUNC(SYSDATE - 1)
                AND TP_STATUS IN ('E')
          GROUP BY  TP_STATUS) E
  WHERE 1=1`
  


    const queryResult = await knex.raw(query);
  
    return queryResult

    } catch (error) {
        console.error("Erro ao executar a querySucessoError:", error);
        throw error;
    }
};



// export const querySucessError = async (): Promise<String> =>{

//     const query = `
//         SELECT 
//       S.SUCESSO,
//       E.ERROS
//   FROM 
//       (SELECT DISTINCT 
//               COUNT(TP_STATUS) SUCESSO,
//               TP_STATUS    
//           FROM 
//               TBL_INM_ATENDIMENTO 
//           WHERE 
//                 TRUNC(TO_DATE(DT_ALTA, 'DD/MM/YYYY HH24:MI:SS')) = TRUNC(SYSDATE - 1)
//                 AND TP_STATUS IN ('T')
//           GROUP BY  TP_STATUS) S,
//           (SELECT DISTINCT 
//               COUNT(TP_STATUS)ERROS,
//               TP_STATUS    
//           FROM 
//               TBL_INM_ATENDIMENTO 
//           WHERE 
//                 TRUNC(TO_DATE(DT_ALTA, 'DD/MM/YYYY HH24:MI:SS')) = TRUNC(SYSDATE - 1)
//                 AND TP_STATUS IN ('E')
//           GROUP BY  TP_STATUS) E
//   WHERE 1=1
    
//     `
  
//     try{
//       const queryResult = await knex.raw(query);
//       const result = queryResult[0];
  
//       const {SUCESSO, ERROS} = result
  
//       const resultFormat =` Quatitativo Sucesso x Erro \n\nSucesso : ${SUCESSO} : Erros :${ERROS}  ` ;
  
//       return resultFormat
  
//     }catch(errorSucessErro){
//       console.error('Erro ao executar consulta QuerySucessErro:', errorSucessErro);
//       throw new Error('Erro ao executar consulta');
//     }
  
  
//   }
  





/**
 * @description Trata os sucessos e erros do banco de dados Oracle
 * @returns {Promise<string>} - string de sucessos e erros
 * @throws {Error} - erro ao executar a queryTratamentoSucessError
 */
export const queryTratamentoSucessError = async () => {
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
        return `<strong>Sucessos:</strong> ${SUCESSO} <br> <strong>Erros:</strong> ${ERROS}`;

    } catch (error) {
        console.error("Erro ao executar a queryTratamentoSucessError:", error);
        throw error;
    }
};