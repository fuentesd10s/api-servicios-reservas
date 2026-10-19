import dotenv from 'dotenv'

//Esto tiene que ir lo antes posible, antes de leer cualquier process.env.
dotenv.config();

const REQUIRED_VARS = ['PORT', 'NODE_ENV'];

function validateEnv() {
    const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

    if (missing.length > 0) {
    console.error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);

    process.exit(1);
    }
  }

  validateEnv();

  const config = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
  };

  export default config;