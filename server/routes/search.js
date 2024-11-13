import express from "express";
import { searchData } from "../controllers/search.js";

const router = express.Router();

router.get("/:search", async (req, res) => {
    try {
        const { search } = req.params;

        if (!search || search.trim().length < 1) {
            return res.status(400).json({
                success: false,
                error: "Search query is required"
            });
        }

        const result = await searchData(search);

        if (!result.success) {
            return res.status(500).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Route error:', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

export const searchRoutes = router;
