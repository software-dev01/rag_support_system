import { Request, Response } from "express";
import FormData from "form-data";

export const upload = async (
    req: Request,
    res: Response
) => {
    try {

        console.log(
            "FILE RECEIVED:"
        );

        console.log(req.file);

        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded",
            });
        }

        const formData =
            new FormData();

        formData.append(
            "file",
            req.file.buffer,
            req.file.originalname
        );

        const response =
            await fetch(
                `${process.env.AI_SERVICE_URL}/upload`,
                {
                    method: "POST",
                    headers:
                        formData.getHeaders(),
                    body: formData as any,
                }
            );

        const data =
            await response.json();

        res.json(data);

    } catch (error) {

        console.error(
            "UPLOAD ERROR:",
            error
        );

        res.status(500).json({
            error: "Upload failed",
        });
    }
};