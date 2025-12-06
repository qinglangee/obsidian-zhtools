import { Editor } from "obsidian";

/**
 * 查找当前光标所在标题及其子内容范围
 * @returns { headerLine, headerLevel, endLine } 或 null（未找到标题）
 */
export function getHeaderRange(editor: Editor) {
	const cursor = editor.getCursor();
	const lineCount = editor.lineCount();
	const lines = editor.getValue().split("\n");

	// --- 1. 向上查找最近的标题 ---
	let headerLine = -1;
	let headerLevel = Infinity;

	for (let i = cursor.line; i >= 0; i--) {
		const text = lines[i].trim();
		const match = text.match(/^(#+)\s+/);
		if (match) {
			headerLine = i;
			headerLevel = match[1].length;
			break;
		}
	}

	if (headerLine === -1) return null;

	// --- 2. 向下查找该标题的内容范围 ---
	let endLine = lineCount - 1;

	for (let i = headerLine + 1; i < lineCount; i++) {
		const text = lines[i].trim();
		const match = text.match(/^(#+)\s+/);
		if (match) {
			const level = match[1].length;
			if (level <= headerLevel) {
				endLine = i - 1;
				break;
			}
		}
	}

	return { headerLine, headerLevel, endLine, lines };
}
