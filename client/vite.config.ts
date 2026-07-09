import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			workbox: {
				maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
				navigateFallback: "index.html",
			},
			manifest: {
				name: "Death Log",
				short_name: "DeathLog",
				description:
					"Death Log is an app that tracks video game deaths and can visualize them with charts",
				theme_color: "#172133",
				icons: [
					{
						src: "/death-log.svg",
						sizes: "any",
						type: "image/svg+xml",
					},
				],
			},
		}),
	],
});
