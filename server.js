import ServerConfig from "./models/serverConfig.js";

const { CONFIG_ID } = process.env;

export default function configureServer(app) {
    app.get("/", async (req, res) => {
        const serverConfig = await ServerConfig.findById(CONFIG_ID)
        res.send(`welcome to ${serverConfig.name}!`);
    });
}