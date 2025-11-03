/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: []
	},
	compress: true,
	
	env: {
	  ADMIN_PSWD: "25222322",
	  CURSEFORGE_API_KEY: "$2a$10$Hdb8uulpzWHDkDbFXAI.BOkT9RYi5nhDVRToSKeDlvoNHwOUh.7pS",
	  CF_URI: "https://api.curseforge.com/v1/mods/search?gameId=78022&primaryAuthorId=121513918"
	}
};

export default nextConfig;
