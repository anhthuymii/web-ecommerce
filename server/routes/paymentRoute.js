import { Router } from "express";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const router = Router();

router.get("/config", (req, res) => {
  return res.status(200).json({
    status: "OK",
    data: process.env.CLIENT_ID,
  });
});

export default router;
