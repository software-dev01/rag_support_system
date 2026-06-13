import { Request, Response } from "express";

export const stream = async (
  req: Request,
  res: Response
) => {
  try {


    console.log(
      "Streaming URL:",
      `${process.env.AI_SERVICE_URL}/stream`
    );

    const response =
      await fetch(
        `${process.env.AI_SERVICE_URL}/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            req.body
          ),
        }
      );

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    if (
      response.body
    ) {
      response.body.pipeTo(
        new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          },
        })
      );
    }
  } catch (error) {
    res.status(500).json({
      error:
        "Streaming failed",
    });
  }
};