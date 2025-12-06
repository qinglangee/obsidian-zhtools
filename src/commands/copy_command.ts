import { Editor, Notice } from "obsidian";
import { getHeaderRange } from "src/utils/editor_utils";
/**
 * 从光标所在处向两边查找完整的 url 链接地址
 * 如果找到，复制地址，如果找不到，什么也没做
 * @param editor
 */
export function copyLink(editor: Editor) {
	const cursor = editor.getCursor();
	const line = editor.getLine(cursor.line);
	const cursorPos = cursor.ch;

	// URL 的正则表达式模式
	// 匹配 http/https URL 和 Obsidian 内部链接
	const urlPattern =
		/(?:https?:\/\/|www\.)[^\s\])>]+|(?:\[\[)[^\]]+(?:\]\])/g;

	let match;
	let foundUrl: string | null = null;

	// 在当前行中查找所有匹配的 URL
	while ((match = urlPattern.exec(line)) !== null) {
		const startPos = match.index;
		const endPos = startPos + match[0].length;

		// 检查光标是否在这个 URL 范围内
		if (cursorPos >= startPos && cursorPos <= endPos) {
			foundUrl = match[0];

			// 如果是 Obsidian 内部链接格式 [[...]]，提取链接内容
			if (foundUrl.startsWith("[[") && foundUrl.endsWith("]]")) {
				foundUrl = foundUrl.slice(2, -2);
				// 处理别名情况 [[link|alias]]
				if (foundUrl.includes("|")) {
					foundUrl = foundUrl.split("|")[0];
				}
			}
			// 如果是 Markdown 链接格式 [text](url)
			else if (line[startPos - 1] === "]" && line[startPos] === "(") {
				// 向前找到完整的 Markdown 链接
				const markdownLinkMatch = line
					.slice(0, endPos)
					.match(/\[([^\]]+)\]\(([^)]+)\)$/);
				if (markdownLinkMatch) {
					foundUrl = markdownLinkMatch[2];
				}
			}

			break;
		}
	}

	// 如果没找到，尝试匹配 Markdown 链接格式 [text](url)
	if (!foundUrl) {
		const markdownPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
		while ((match = markdownPattern.exec(line)) !== null) {
			const startPos = match.index;
			const endPos = startPos + match[0].length;

			if (cursorPos >= startPos && cursorPos <= endPos) {
				foundUrl = match[2]; // 提取 URL 部分
				break;
			}
		}
	}

	// 如果找到了 URL，复制到剪贴板
	if (foundUrl) {
		navigator.clipboard
			.writeText(foundUrl)
			.then(() => {
				// 可选：显示通知
				new Notice("链接已复制: " + foundUrl);
			})
			.catch((err) => {
				console.error("复制失败:", err);
			});
	}
}

/**
 * 选择并复制从 start 行到 end 行的内容
 * @param editor
 * @param start
 * @param end
 */
async function selectAndCopy(editor: Editor, start: number, end: number) {
	const lines = editor.getValue().split("\n");
	const from = { line: start, ch: 0 };
	const to = { line: end, ch: lines[end].length };

	editor.setSelection(from, to);
	const text = editor.getRange(from, to);

	await navigator.clipboard.writeText(text);
}

/**
 * 复制标题+子内容（包含标题）
 */
export async function copySubText(editor: Editor) {
	const result = getHeaderRange(editor);
	if (!result) return;

	const { headerLine, endLine } = result;
	selectAndCopy(editor, headerLine, endLine);
}

/**
 * 复制标题下的内容（❌不包含标题本身）
 */
export async function copySubTextWithoutHeader(editor: Editor) {
	const result = getHeaderRange(editor);
	if (!result) return;

	const { headerLine, endLine } = result;

	// 如果标题没有子内容，就什么都不选
	if (headerLine === endLine) return;
	selectAndCopy(editor, headerLine + 1, endLine);
}
