export async function healthCheck() {
    res.json({
        status: "ok",
        message: "Backend is running",
    });
}