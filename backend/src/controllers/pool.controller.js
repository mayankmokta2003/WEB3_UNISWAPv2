import Pool from "../models/Pool.js";
export async function getAllPools(req, res) {
    try {
        const pools = await Pool.find({});
        res.json(pools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}