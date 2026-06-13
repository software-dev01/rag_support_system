import {
  Router,
} from "express";

import {
  chat,
} from "../controllers/chat.controller";

import {
  stream,
} from "../controllers/stream.controller";
import axios from "axios";
import multer from "multer";
import { upload } from "../controllers/upload.controller";
import { reingest } from "../controllers/reingest.controller";

const router =
  Router();



const uploadMiddleware =
  multer({
    storage:
      multer.memoryStorage(),
  });


router.post(
  "/ask",
  chat
);

router.post(
  "/stream",
  stream
);

router.post(
  "/upload",
  (req, res, next) => {
    uploadMiddleware.single("file")(
      req,
      res,
      (err) => {

        if (err) {
          console.error(
            "MULTER ERROR:",
            err
          );

          return res
            .status(500)
            .json({
              error:
                "Multer failed",
            });
        }

        next();
      }
    );
  },
  upload
);

router.post(
  "/reingest",
  reingest
);


router.get(
  "/test-ai",
  async (_req, res) => {
    try {
      const response =
        await axios.get(
          `${process.env.AI_SERVICE_URL}/debug`
        );

      return res.json({
        success: true,
        data: response.data,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        error: error.message,
        details:
          error.response?.data,
      });
    }
  }
);

export default router;