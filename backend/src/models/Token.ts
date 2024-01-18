import { DataTypes, Model } from "sequelize";
import sequelize from "../database/postgres";

class Token extends Model {
  public id!: number;
  public token!: string;
  public card_number!: number;
  public cvv!: number;
  public expiration_month!: string;
  public expiration_year!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    card_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cvv: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiration_month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration_year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Token",
    tableName: "tokens",
    timestamps: true,
  }
);

export default Token;
