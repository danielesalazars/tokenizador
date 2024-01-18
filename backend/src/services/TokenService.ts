import redis from "../database/redis";
import Token from "../models/Token";
import { generateToken } from "../helpers";
import { Op } from "sequelize";

class TokenService {
  static async generateTokenCard(
    card_number: number,
    cvv: number,
    expiration_month: string,
    expiration_year: string,
    email: string
  ) {
    try {
      const key = `${card_number}:${cvv}:${expiration_month}:${expiration_year}:${email}`;
      const existingToken = await redis.get(key);

      if (existingToken) {
        return JSON.parse(existingToken);
      }

      const existingRecord = await Token.findOne({
        where: {
          card_number,
          cvv,
          expiration_month,
          expiration_year,
          email,
        },
        order: [["id", "DESC"]],
      });

      if (existingRecord) {
        const expirationTime = 15 * 60 * 1000;
        const tokenCreationTime = new Date(existingRecord.createdAt).getTime();
        const currentTime = new Date().getTime();

        if (currentTime - tokenCreationTime < expirationTime) {
          return existingRecord.token;
        } else {
          await existingRecord.destroy();
        }
      }

      const newToken = generateToken();

      try {
        const createdToken = await Token.create({
          card_number,
          cvv,
          expiration_month,
          expiration_year,
          email,
          token: newToken,
        });

        if (createdToken) {
          await redis.setex(key, 900, JSON.stringify(newToken));
          return newToken;
        } else {
          throw new Error("No se pudo crear el token en la base de datos.");
        }
      } catch (validationError) {
        console.error(
          "Error de validación al crear el token:",
          validationError
        );
        throw new Error("Error al crear el token en la base de datos.");
      }
    } catch (error) {
      console.error(`Error al obtener el token: ${error}`);
      throw new Error(`Error al obtener el token: ${error}`);
    }
  }

  static async recoverCardData(token: string) {
    try {
      const existingRecord = await Token.findOne({
        attributes: {
          exclude: ["cvv"],
        },
        where: {
          token,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 15 * 60 * 1000),
          },
        },
        order: [["id", "DESC"]],
      });

      if (existingRecord) {
        return existingRecord;
      }
      return null;
    } catch (error) {
      throw new Error(`Error al obtener datos de la tarjeta: ${error}`);
    }
  }

  static async getTokenAll() {
    try {
      const token = await Token.findAll();
      return token;
    } catch (error) {
      throw new Error(`Error al obtener los tokens: ${error}`);
    }
  }
}

export default TokenService;
