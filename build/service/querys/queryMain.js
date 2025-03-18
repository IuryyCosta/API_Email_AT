"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/service/querys/queryMain.ts
var queryMain_exports = {};
__export(queryMain_exports, {
  queryMain: () => queryMain,
  queryTratamentoMain: () => queryTratamentoMain
});
module.exports = __toCommonJS(queryMain_exports);

// src/database/config.ts
var import_knex = require("knex");

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

// src/database/config.ts
var import_oracledb = __toESM(require("oracledb"));
var oracled = import_oracledb.default.initOracleClient({ libDir: env.ORACLE_LIB_DIR });
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
var knex = (0, import_knex.knex)(config);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  queryMain,
  queryTratamentoMain
});
