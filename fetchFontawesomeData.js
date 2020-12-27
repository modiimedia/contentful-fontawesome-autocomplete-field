const yaml = require("js-yaml");
const fs = require("fs");

const createFontawesomeTs = (doc) => {
	fs.writeFileSync(
		"./src/fontawesome.ts",
		`
interface Icon {
	changes: string[];
	label: string;
	search: {
		terms: string[];
	};
	styles: string[];
	unicode: string;
	voted?: boolean;
	private?: boolean;
	ligatures?: string[];
}

const faData: { [key: string]: Icon } = ${JSON.stringify(doc)};

export default faData`
	);
};

try {
	const doc = yaml.safeLoad(
		fs.readFileSync(
			"./node_modules/@fortawesome/fontawesome-free/metadata/icons.yml",
			"utf8"
		)
	);
	createFontawesomeTs(doc);
} catch (e) {
	console.error(e);
}
