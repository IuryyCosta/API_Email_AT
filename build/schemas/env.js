"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/schemas/env.ts
var env_exports = {};
__export(env_exports, {
  env: () => env,
  envSchema: () => envSchema
});
module.exports = __toCommonJS(env_exports);
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  PORT: import_zod.z.string().transform(Number),
  NODE_ENV: import_zod.z.enum(["development", "production"]),
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
var env = envSchema.parse(process.env);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  env,
  envSchema
});
