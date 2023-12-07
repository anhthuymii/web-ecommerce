import { Router } from "express";
import dotenv from "dotenv";
import express from "express";
import esService from "../config/es.js";
dotenv.config();

const router = Router();

router.get("/:search", async (req, res) => {
  console.log("search");
  const searchTerm = req.params.search;
  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10;

  const result = await esService.search(searchTerm);

  res.status(200).json({ result });
});

export default router;
