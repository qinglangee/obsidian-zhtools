/**
 * 从函数名中生成 kebab-case 和 Title Case
 */
export function parseFunctionName(func: Function): {
	kebab: string;
	title: string;
} {
	const name = func.name;

	if (!name) {
		throw new Error("Function must have a name.");
	}

	// 将驼峰/帕斯卡式拆分成单词
	const words = name.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)/g);
	if (!words) {
		return { kebab: name.toLowerCase(), title: name };
	}

	// kebab-case
	const kebab = words.map((w) => w.toLowerCase()).join("-");

	// Title Case：每个单词首字母大写
	const title = words
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");

	return { kebab, title };
}
