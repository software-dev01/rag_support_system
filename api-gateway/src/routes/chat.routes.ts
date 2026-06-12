import {
  Router,
} from "express";

import {
  chat,
} from "../controllers/chat.controller";

import {
  stream,
} from "../controllers/stream.controller";

const router =
  Router();

router.post(
  "/ask",
  chat
);

router.post(
  "/stream",
  stream
);

export default router;