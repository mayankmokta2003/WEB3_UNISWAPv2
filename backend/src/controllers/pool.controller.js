import Pool from "../models/Pool.js";
import { getReserves } from "../services/blockchain.service.js";

export async function syncPool(req, res) {

    const { pairAddress, token0, token1 } = req.body;
    const reserves = await getReserves(pairAddress);

    const pool = await Pool.findOneAndUpdate(
        { pairAddress },
        { token0, token1, ...reserves },
        { upsert: true, new: true },
    );
        res.json(pool);
}

export async function getPools(req, res){
    const pools = await Pool.find();
    res.json(pools);
}