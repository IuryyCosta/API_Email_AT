"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"));

// src/service/oracle.ts
var import_knex = require("knex");
var import_oracledb = __toESM(require("oracledb"));
var getOracleConnection = async (host, user, password, database, connectString) => {
  try {
    import_oracledb.default.initOracleClient({ libDir: process.env.ORACLE_LIB_DIR });
    const oracleKnex = (0, import_knex.knex)({
      client: "oracledb",
      connection: {
        host,
        user,
        password,
        database,
        connectString
      },
      pool: {
        min: 2,
        max: 10,
        createTimeoutMillis: 3e3,
        acquireTimeoutMillis: 3e4,
        idleTimeoutMillis: 3e4
      }
    });
    const result = await oracleKnex.raw("SELECT 1 FROM DUAL");
    return `Conex\xE3o com Oracle estabelecida com sucesso: ${result}`;
  } catch (error) {
    console.error("Erro ao conectar ao Oracle:", error);
    throw error;
  }
};

// src/schemas/index.ts
var import_zod = require("zod");
var import_config = require("dotenv/config");
var sendEmailSchema = import_zod.z.object({
  PORT: import_zod.z.coerce.number().default(3e3),
  NODE_ENV: import_zod.z.enum(["development", "production"]).default("production"),
  RESEND_API_KEY: import_zod.z.string(),
  EMAIL_FROM: import_zod.z.string(),
  EMAIL_TO: import_zod.z.string(),
  ORACLE_HOST: import_zod.z.string(),
  ORACLE_USER: import_zod.z.string(),
  ORACLE_PASSWORD: import_zod.z.string(),
  ORACLE_DATABASE: import_zod.z.string(),
  ORACLE_LIB_DIR: import_zod.z.string(),
  ORACLE_CONNECT_STRING: import_zod.z.string(),
  EXECUTION_HOUR: import_zod.z.string().transform(Number).pipe(
    import_zod.z.number().min(0).max(23)
  ),
  EXECUTION_MINUTE: import_zod.z.string().transform(Number).pipe(
    import_zod.z.number().min(0).max(59)
  )
});
var _env = sendEmailSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u274C Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/controller/SendEmail.ts
var import_resend = require("resend");

// src/database/config.ts
var import_knex2 = require("knex");
var import_oracledb2 = __toESM(require("oracledb"));
var oracled = import_oracledb2.default.initOracleClient({ libDir: env.ORACLE_LIB_DIR });
var config = {
  client: "oracledb",
  connection: {
    user: env.ORACLE_USER,
    password: env.ORACLE_PASSWORD,
    connectString: env.ORACLE_CONNECT_STRING,
    // Configurações específicas do Oracle
    // privilege: oracledb.SYSDBA,
    // Forçar o uso do modo THICK
    thin: false
  },
  pool: {
    min: 2,
    max: 10
  }
};
var knex = (0, import_knex2.knex)(config);

// src/service/querys/queryErros.ts
var queryErros = async () => {
  try {
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
    const result = await knex.raw(query);
    console.log(`Query executada com sucesso: ${JSON.stringify(result)}`);
    return result.rows || result;
  } catch (queryErros2) {
    console.error("Erro ao executar a queryErros:", queryErros2);
    throw queryErros2;
  }
};
var queryTratamentoErros = async () => {
  const result = await queryErros();
  if (!Array.isArray(result) || result.length === 0) {
    return [];
  }
  const tratamento = result.map(
    (item) => {
      return {
        descricao: item.DS_ERRO,
        quantidade: item.DS_ERRO_COUNT
      };
    }
  );
  return tratamento;
};

// src/service/querys/querySucessError.ts
var querySucessError = async () => {
  try {
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
  WHERE 1=1`;
    const queryResult = await knex.raw(query);
    return queryResult;
  } catch (error) {
    console.error("Erro ao executar a querySucessoError:", error);
    throw error;
  }
};
var queryTratamentoSucessError = async () => {
  try {
    const result = await querySucessError();
    if (!Array.isArray(result) || result.length === 0) {
      return "Nenhum resultado encontrado Consulta Sucesso/Erro";
    }
    const { SUCESSO, ERROS } = result[0];
    return `<strong>Sucessos:</strong> ${SUCESSO} <br> <strong>Erros:</strong> ${ERROS}`;
  } catch (error) {
    console.error("Erro ao executar a queryTratamentoSucessError:", error);
    throw error;
  }
};

// src/service/querys/queryMain.ts
var queryMain = async () => {
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
            AND TRUNC(dt_alta) = TRUNC(SYSDATE - 1) -- Altera\xE7\xE3o para pegar o dia anterior
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
                    AND TRUNC(dt_alta) = TRUNC(SYSDATE - 1) -- Altera\xE7\xE3o para pegar o dia anterior
            )
    ) api 
    ON mv.nr_atendimento = api.nr_atendimento
    `;
  const result = await knex.raw(query);
  return result;
};
var queryTratamentoMain = async () => {
  try {
    const result = await queryMain();
    if (result.length === 0) {
      return "Nenhum resultado encontrado";
    }
    const { LEGADO, API, DIFERENCA } = result[0];
    return `<br> <strong> Legado:</strong> ${LEGADO} <br> 
                <strong>API:</strong> ${API} <br>
                <strong>DIFERENCA:</strong> ${DIFERENCA}`;
  } catch (error) {
    console.error("Erro ao executar a queryTratamentoMain:", error);
    throw error;
  }
};

// src/utils/htmlFile.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var htmlFile = async () => {
  const htmlFile2 = import_path.default.resolve(__dirname, "../templates/email.html");
  let htmlContent = import_fs.default.readFileSync(htmlFile2, "utf-8");
  const totalLegado = await queryTratamentoErros();
  const totalSucesso = await queryTratamentoSucessError();
  const totalErro = await queryTratamentoMain();
  if (totalLegado === void 0 || totalSucesso === void 0 || totalErro === void 0) {
    throw new Error("Erro ao obter dados para o HTML.");
  }
  const errosAgrupados = await queryTratamentoErros();
  const errosHtml = errosAgrupados.map((erro) => {
    return `<tr><td>${erro.descricao}</td><td>${erro.quantidade}</td></tr>`;
  }).join("");
  const dataExtra\u00E7\u00E3o = getYesterdayDate();
  htmlContent = htmlContent.replace(/\[TOTAL_LEGADO\]/g, totalLegado.toString());
  htmlContent = htmlContent.replace(/\[TOTAL_SUCESSO\]/g, totalSucesso);
  htmlContent = htmlContent.replace(/\[TOTAL_ERRO\]/g, totalErro);
  htmlContent = htmlContent.replace(/\[ERROS_AGRUPADOS\]/g, errosHtml);
  htmlContent = htmlContent.replace(/\[DATA_EXTRACAO\]/g, dataExtra\u00E7\u00E3o);
  return htmlContent;
};
var getYesterdayDate = () => {
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
};

// src/controller/SendEmail.ts
var SendEmailController = class {
  async create() {
    const { EMAIL_FROM, EMAIL_TO, RESEND_API_KEY } = env;
    const resend = new import_resend.Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: "Atendimento Paciente - Relat\xF3rio de Erros",
      html: await htmlFile()
    });
    if (error) {
      throw new Error(error.message);
    }
    return { message: "Email sent successfully" };
  }
};

// src/service/sendAutomatic.ts
var SendAutomatic = class {
  constructor() {
    this.sendEmail = new SendEmailController();
  }
  /**  
   * @description Executa o processo de envio de emails automaticamente
   * @returns {Promise<{ erros: any[], sucess: any[], main: any[], email: any }>} Retorna um objeto com os resultados das consultas e o envio do email
   * @example
   * const sendAutomatic = new SendAutomatic();
   * sendAutomatic.execute(); // Executa o processo de envio de emails automaticamente
   */
  async execute() {
    try {
      console.log("Iniciando a consulta de erros ao banco de dados");
      const errosResult = await queryTratamentoErros();
      console.log("Consulta de erros finalizada:", errosResult);
      console.log("Iniciando a consulta de sucesso ao banco de dados");
      const sucessResult = await queryTratamentoSucessError();
      console.log("Consulta de sucesso finalizada:", sucessResult);
      console.log("Iniciando a consulta principal ao banco de dados");
      const mainResult = await queryTratamentoMain();
      console.log("Consulta principal finalizada:", mainResult);
      console.log("Iniciando o envio de emails");
      const emailResult = await this.sendEmail.create();
      console.log("Email enviado com sucesso", emailResult);
      return {
        erros: errosResult,
        sucess: sucessResult,
        main: mainResult,
        email: emailResult
      };
    } catch (error) {
      console.error("Erro no processo do envio autom\xE1tico", error);
      throw new Error(`Falha no processo autom\xE1tico: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  }
  scheduleExecution() {
    const targetHour = Number(env.EXECUTION_HOUR);
    const targetMinute = Number(env.EXECUTION_MINUTE);
    console.log(`Agendando execu\xE7\xE3o autom\xE1tica para ${targetHour}:${targetMinute.toString().padStart(2, "0")} todos os dias`);
    const scheduleNextExecution = () => {
      const now = /* @__PURE__ */ new Date();
      const nextExecution = /* @__PURE__ */ new Date();
      nextExecution.setHours(targetHour, targetMinute, 0, 0);
      if (now.getTime() > nextExecution.getTime()) {
        nextExecution.setDate(nextExecution.getDate() + 1);
      }
      const delay = nextExecution.getTime() - now.getTime();
      console.log(`Pr\xF3xima execu\xE7\xE3o agendada para: ${nextExecution.toLocaleString()}`);
      setTimeout(() => {
        this.execute().catch(console.error);
        scheduleNextExecution();
      }, delay);
    };
    scheduleNextExecution();
  }
};

// src/app.ts
var app = (0, import_fastify.default)();
getOracleConnection(env.ORACLE_HOST, env.ORACLE_USER, env.ORACLE_PASSWORD, env.ORACLE_DATABASE, env.ORACLE_CONNECT_STRING);
var automaticService = new SendAutomatic();
automaticService.scheduleExecution();
app.get("/", async (request, reply) => {
  const result = await automaticService.execute();
  return reply.status(200).send({ message: result });
});

// src/server.ts
app.listen({
  port: env.PORT,
  host: "0.0.0.0"
}).then(() => {
  console.log(`HTTP server running! http://localhost:${env.PORT}`);
});
