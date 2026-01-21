export async function healthCheck(req,res) {
    res.json({
        status: "ok",
        message: "Backend is running",
    });
}