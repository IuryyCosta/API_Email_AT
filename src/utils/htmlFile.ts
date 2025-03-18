import { queryTratamentoErros } from "@/service/querys/queryErros";
import { queryTratamentoSucessError } from "@/service/querys/querySucessError";
import { queryTratamentoMain } from "@/service/querys/queryMain";
import fs from "fs";
import path from "path";

export const htmlFile = async (): Promise<string> => {
    const htmlFile = path.resolve(__dirname, "../../templates/email.html");
    console.log("Caminho do arquivo HTML:", htmlFile);
    let htmlContent = fs.readFileSync(htmlFile, "utf-8");

    const totalLegado = await queryTratamentoErros();
    const totalSucesso = await queryTratamentoSucessError();
    const totalErro = await queryTratamentoMain();

    if (totalLegado === undefined || totalSucesso === undefined || totalErro === undefined) {
        throw new Error("Erro ao obter dados para o HTML.");
    }

    // Formatação dos dados
    const errosAgrupados = await queryTratamentoErros(); // Supondo que isso retorne um array de erros
    const errosHtml = errosAgrupados.map((erro: { descricao: string; quantidade: number }) => {
        return `<tr><td>${erro.descricao}</td><td>${erro.quantidade}</td></tr>`;
    }).join('');

    const dataExtração = getYesterdayDate();

    htmlContent = htmlContent.replace(/\[TOTAL_LEGADO\]/g, totalLegado.toString());
    htmlContent = htmlContent.replace(/\[TOTAL_SUCESSO\]/g, totalSucesso);
    htmlContent = htmlContent.replace(/\[TOTAL_ERRO\]/g, totalErro);
    htmlContent = htmlContent.replace(/\[ERROS_AGRUPADOS\]/g, errosHtml);
    htmlContent = htmlContent.replace(/\[DATA_EXTRACAO\]/g, dataExtração);
    
    //console.log(htmlContent);

    return htmlContent;
}

const getYesterdayDate = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Subtrai um dia
    return yesterday.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); // Formata a data
};