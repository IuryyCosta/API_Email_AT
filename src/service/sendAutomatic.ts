import { SendEmailController } from "../controller/SendEmail";
import { queryTratamentoErros } from "./querys/queryErros";
import { queryTratamentoMain } from "./querys/queryMain";
import { queryTratamentoSucessError } from "./querys/querySucessError";
import { env } from "@/schemas";

/**
 * @description Classe para enviar emails automaticamente
 * @author Iury Consulta
 * @version 1.0.0
 * 
 */
export class SendAutomatic {

    private sendEmail: SendEmailController;

    constructor() {
        this.sendEmail = new SendEmailController();
    }

    async execute() {
        try{
            console.log("Iniciando as consultas ao banco de dados");

            const [errosResult, sucessResult, mainResult] = await Promise.all([
                queryTratamentoErros(),
                queryTratamentoSucessError(),
                queryTratamentoMain()
            ]);
            
            console.log("Consultas ao banco de dados finalizadas");
            console.log(({
                erros: errosResult,
                sucess: sucessResult,
                main: mainResult
            }));

            console.log("Iniciando o envio de emails");
            
            const emailResult = await this.sendEmail.create();
            console.log("Email enviado com sucesso", emailResult);

            return {
                erros: errosResult,
                sucess: sucessResult,
                main: mainResult,
                email: emailResult
            }
            
        } catch (error) {
            console.error("Erro no processo do envio automatico", error);
            throw new Error(`Falha no processo automático: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
            
    }

 
    scheduleExecution() {
        const targetHour = Number(env.EXECUTION_HOUR);
        const targetMinute = Number(env.EXECUTION_MINUTE);
        
        console.log(`Agendando execução automática para ${targetHour}:${targetMinute.toString().padStart(2, '0')} todos os dias`);

        const scheduleNextExecution = () => {
            const now = new Date();
            const nextExecution = new Date();
            nextExecution.setHours(targetHour, targetMinute, 0, 0); // Define hora e minuto

            // Se já passou do horário hoje, agenda para amanhã
            if (now.getTime() > nextExecution.getTime()) {
                nextExecution.setDate(nextExecution.getDate() + 1);
            }

            const delay = nextExecution.getTime() - now.getTime();
            
            console.log(`Próxima execução agendada para: ${nextExecution.toLocaleString()}`);

            // Agenda a próxima execução
            setTimeout(() => {
                this.execute().catch(console.error);
                scheduleNextExecution(); // Agenda a próxima execução
            }, delay);
        };

        // Inicia o agendamento
        scheduleNextExecution();
    }
}
