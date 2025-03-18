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

// src/service/oracle.ts
var oracle_exports = {};
__export(oracle_exports, {
  getOracleConnection: () => getOracleConnection
});
module.exports = __toCommonJS(oracle_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getOracleConnection
});
