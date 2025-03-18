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

// src/service/querys/queryErros.ts
var queryErros_exports = {};
__export(queryErros_exports, {
  queryErros: () => queryErros,
  queryTratamentoErros: () => queryTratamentoErros
});
module.exports = __toCommonJS(queryErros_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  queryErros,
  queryTratamentoErros
});
