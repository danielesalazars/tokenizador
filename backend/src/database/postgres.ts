import { Options, Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.POSTGRES_SERVICE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  logging: false,
});

sequelize
  .authenticate()
  // .then(() => {
  //   console.log("Conexión a la base de datos establecida correctamente.");
  // })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error);
  });

export default sequelize;
