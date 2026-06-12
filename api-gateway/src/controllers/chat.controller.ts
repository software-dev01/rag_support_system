import { Request, Response } from "express";
import { askAI } from "../services/ai.service";

export const chat = async (
  req: Request,
  res: Response
) => {
  try {
    const { question } =
      req.body;

    const data =
      await askAI(
        question
      );

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "AI Service unavailable",
    });
  }
};