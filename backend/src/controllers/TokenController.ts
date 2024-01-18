import { IncomingMessage, ServerResponse } from "http";
import TokenService from "../services/TokenService";
import {
  isValidCard,
  isValidEmail,
  isValidExpirationMonth,
  isValidExpirationYear,
  sendErrorResponse,
} from "../helpers";

export const getTokenAll = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const tokens = await TokenService.getTokenAll();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            data: tokens,
            status: 200,
            message: "OK",
          })
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error al procesar los datos" }));
      }
    });
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error interno del servidor" }));
  }
};

export const generateTokenCard = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    await new Promise((resolve) => {
      req.on("end", resolve);
    });

    const postData = JSON.parse(body);
    const { card_number, cvv, expiration_month, expiration_year, email } =
      postData;

    const errors = {} as { [key: string]: string };

    if (!isValidCard(card_number)) {
      errors.cardNumber = `La tarjeta no es válida.`;
    }

    if (typeof cvv !== "number" || isNaN(cvv) || cvv.toString().length > 4) {
      errors.cvv = "El CVV no es válido.";
    }

    if (!isValidExpirationMonth(expiration_month)) {
      errors.expirationMonth = `El mes no es válido.`;
    }

    if (!isValidExpirationYear(expiration_year)) {
      errors.expirationYear = `El año ${expiration_year} no es válido.`;
    }

    if (!isValidEmail(email)) {
      errors.email = "Email no válido";
    }

    if (Object.keys(errors).length > 0) {
      sendErrorResponse(res, 400, errors);
      return;
    }

    const tokenValidate = await TokenService.generateTokenCard(
      card_number,
      cvv,
      expiration_month,
      expiration_year,
      email
    );

    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(
      JSON.stringify({
        data: tokenValidate,
        status: 200,
        message: "Token creado",
      })
    );
  } catch (error) {
    console.error("Error in generateTokenCard:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error interno del servidor" }));
  }
};

export const recoverCardData = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    console.log("hola mundo");
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    await new Promise((resolve) => {
      req.on("end", resolve);
    });

    const postData = JSON.parse(body);

    const token = postData.token;

    const tokenData = await TokenService.recoverCardData(token);

    if (!tokenData) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          data: tokenData,
          status: 400,
          message: "Token expirado",
        })
      );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        data: tokenData,
        status: 200,
        message: "Token data recover",
      })
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error interno del servidor" }));
  }
};
