import { IncomingMessage, ServerResponse } from "http";
import {
  generateTokenCard,
  recoverCardData,
} from "../controllers/TokenController";

jest.mock("../services/TokenService", () => ({
  generateTokenCard: jest.fn(),
  recoverCardData: jest.fn(),
}));

const mockGenerateTokenCard = require("../services/TokenService")
  .generateTokenCard as jest.Mock;

const mockRecoverCardData = require("../services/TokenService")
  .recoverCardData as jest.Mock;

describe("TokenController Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateTokenCard.mockClear();
  });

  test("generateTokenCard should return success response", async () => {
    const req: Partial<IncomingMessage> = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "data") {
          const postData = {
            card_number: 4970100000000055,
            cvv: 123,
            expiration_month: "12",
            expiration_year: "2025",
            email: "daniel.esalazars@gmail.com",
          };
          callback(JSON.stringify(postData));
        } else if (event === "end") {
          callback();
        }
      }),
      method: "POST",
    };
    const res: Partial<ServerResponse> = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    const mockTokenValidate = "mockedToken";
    mockGenerateTokenCard.mockResolvedValue(mockTokenValidate);

    await generateTokenCard(req as IncomingMessage, res as ServerResponse);

    expect(res.writeHead).toHaveBeenCalledWith(200, {
      "Content-Type": "application/json",
    });

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: mockTokenValidate,
        status: 200,
        message: "Token creado",
      })
    );
  });

  test("generateTokenCard should return error response", async () => {
    const req: Partial<IncomingMessage> = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "data") {
          const postData = {
            card_number: 4970100000000055,
            cvv: 123,
            expiration_month: "12",
            expiration_year: "2023",
            email: "daniel.esalazars@gmail.com",
          };
          callback(JSON.stringify(postData));
        } else if (event === "end") {
          callback();
        }
      }),
      method: "POST",
    };
    const res: Partial<ServerResponse> = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    const mockValidationError = {
      expirationYear: "El año 2023 no es válido.",
    };
    mockGenerateTokenCard.mockRejectedValue({
      validationError: mockValidationError,
    });

    await generateTokenCard(req as IncomingMessage, res as ServerResponse);

    expect(res.writeHead).toHaveBeenCalledWith(400, {
      "Content-Type": "application/json",
    });

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        status: 400,
        message: "Error de validación en los datos",
        error: mockValidationError,
      })
    );
  });

  test("recoverCardData should return token data", async () => {
    const mockToken = "mockedToken";
    const req: Partial<IncomingMessage> = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "data") {
          const postData = {
            token: mockToken,
          };
          callback(JSON.stringify(postData));
        } else if (event === "end") {
          callback();
        }
      }),
      method: "POST",
    };
    const res: Partial<ServerResponse> = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    const mockTokenData = {
      id: 1,
      card_number: 1234567890123456,
      expiration_month: "12",
      expiration_year: "2023",
      email: "test@example.com",
      token: mockToken,
    };

    mockRecoverCardData.mockResolvedValue(mockTokenData);

    await recoverCardData(req as IncomingMessage, res as ServerResponse);

    expect(res.writeHead).toHaveBeenCalledWith(200, {
      "Content-Type": "application/json",
    });

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        data: mockTokenData,
        status: 200,
        message: "Token data recover",
      })
    );
  });

  test("recoverCardData should return error response", async () => {
    const req: Partial<IncomingMessage> = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "data") {
          const postData = {
            token: "mockedToken",
          };
          callback(JSON.stringify(postData));
        } else if (event === "end") {
          callback();
        }
      }),
      method: "POST",
    };
    const res: Partial<ServerResponse> = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    mockRecoverCardData.mockRejectedValue(new Error("Internal Server Error"));

    await recoverCardData(req as IncomingMessage, res as ServerResponse);

    expect(res.writeHead).toHaveBeenCalledWith(500, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Error interno del servidor" })
    );
  });
});
