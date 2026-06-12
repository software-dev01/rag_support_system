import { Request, Response } from "express";

export const stream = async (
  req: Request,
  res: Response
) => {
  try {
    const response =
      await fetch(
        "http://localhost:8000/stream",
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