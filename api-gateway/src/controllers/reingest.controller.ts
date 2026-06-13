import { Request, Response } from "express";

export const reingest = async (
  _req: Request,
  res: Response
) => {
  try {

    const response =
      await fetch(
        `${process.env.AI_SERVICE_URL}/reingest`,
        {
          method: "POST",
        }
      );

    const data =
      await response.json();

    res.json(data);

  } catch (error) {

    console.error(
      "REINGEST ERROR:",
      error
    );

    res.status(500).json({
      error:
        "Reingest failed",
    });
  }
};