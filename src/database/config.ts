import { env } from "@/schemas";
import { knex as setupKnex } from "knex";
import oracle from "oracledb";

oracle.initOracleClient({
  libDir: env.ORACLE_LIB_DIR,
});

export const configOracle = {
  client: "oracledb",
  connection: {
    host: env.ORACLE_HOST,
    user: env.ORACLE_USER,
    password: env.ORACLE_PASSWORD,
    database: env.ORACLE_DATABASE,
    connectString: env.ORACLE_CONNECT_STRING,
  },
};

export const knex = setupKnex(configOracle);
