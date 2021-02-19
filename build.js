const esbuild = require("esbuild")

esbuild
  .build({
    entryPoints: ["./src/index.jsx"],
    external: ["react", "prop-types", "@sanity/block-content-to-react"],
    bundle: true,
    minify: true,
    outdir: "dist",
    target: "es2017",
    format: "cjs",
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
