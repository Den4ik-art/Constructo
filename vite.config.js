import { defineConfig } from "vite";
import pugPlugin from "vite-plugin-pug";

const options = { pretty: true };
const lacals = { name: "My Pug" };

export default defineConfig({
    plugins: [pugPlugin(undefined, { pagesUrl: "./pages/" })],
});