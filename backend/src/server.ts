import { createApp } from "./app";
import { createConfig } from "./config";

const config = createConfig()

const app = createApp(config);

app.listen(config.serverPort, () => {
	console.log(`App is listening on http://localhost:${config.serverPort}/`);
});