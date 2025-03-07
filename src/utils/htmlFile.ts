import { queryTratamentoErros } from "@/service/querys/queryErros";
import { queryTratamentoSucessError } from "@/service/querys/querySucessError";
import { queryTratamentoMain } from "@/service/querys/queryMain";
import fs from "fs";
import path from "path";

export const htmlFile = async (): Promise<string> => {
 
    const htmlFile = path.join(__dirname, "./src/templates/email.html");
    let  htmlContent = fs.readFileSync(htmlFile, "utf-8");

    htmlContent = htmlContent.replace(/{{erros}}/, await queryTratamentoErros());
    htmlContent = htmlContent.replace(/{{sucesso}}/, await queryTratamentoSucessError());
    htmlContent = htmlContent.replace(/{{main}}/, await queryTratamentoMain());

    console.log(htmlContent);
    
    return htmlContent;
}



