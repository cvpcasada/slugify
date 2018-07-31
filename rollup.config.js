import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

import pkg from "./package.json";

const external = [
	...Object.keys(pkg.peerDependencies || {}),
	...Object.keys(pkg.dependencies || {})
];

const makeExternalPredicate = externalArr => {
	if (externalArr.length === 0) {
		return () => false;
	}
	const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
	return id => pattern.test(id);
};

export default {
	input: "index.js",
	output: {
		file: pkg.main,
		format: "cjs"
	},
	external: makeExternalPredicate(external),
	plugins: [
		resolve({ preferBuiltins: false }),
		commonjs({
			include: "node_modules/**"
		}),
		babel({
			babelrc: false,
			presets: [
				[
					"env",
					{
						targets: {
							browsers: [">0.25%", "not ie 11", "not op_mini all"]
						},
						loose: true,
						modules: false
					}
				]
			],
			plugins: [
				"lodash",
				[
					"transform-runtime",
					{ helpers: true, polyfill: false, regenerator: false }
				]
			],
			runtimeHelpers: true
		})
	]
};
