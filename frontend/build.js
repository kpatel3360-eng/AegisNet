import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBuild() {
  try {
    console.log("Bundling AegisNet React Frontend with Esbuild...");
    await esbuild.build({
      entryPoints: ['src/main.jsx'],
      bundle: true,
      outfile: 'dist/bundle.js',
      loader: { '.js': 'jsx', '.jsx': 'jsx' },
      define: { 'process.env.NODE_ENV': '"development"' },
      sourcemap: true,
      minify: false,
    });
    console.log("Bundle created successfully at dist/bundle.js!");
  } catch (err) {
    console.error("Esbuild bundle error:", err);
    process.exit(1);
  }
}

runBuild();
