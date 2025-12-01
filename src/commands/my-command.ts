import { Editor, Notice } from "obsidian";

/**
 * 如果选中了内容就替换选中的内容， 没有选中就替换全部的内容
 * @param editor
 * @param replaceFun 替换函数， 把内容进行转换
 */
function replaceContent(editor: Editor, replaceFun: (e: string) => string) {
	let content = editor.getSelection();
	const hasSelection = content.length > 0;
	if (hasSelection) {
		const replaced = replaceFun(content); // 两个 newlines 替换为一个
		editor.replaceSelection(replaced);
	} else {
		content = editor.getValue(); // 取得全文
		const replaced = replaceFun(content); // 两个 newlines 替换为一个
		editor.setValue(replaced); // 设置全文
	}
}

/**
 * 把编辑器的连续两个换行全部换成一个换行
 */
export function mergeDoubleNewLines(editor: Editor) {
	replaceContent(editor, (text) => text.replace(/\n\n/g, "\n"));
}

/**
 * 删除 markdown 中的所有 [text](url) 形式的链接
 * @param editor
 */
export function removeLinks(editor: Editor) {
	replaceContent(editor, (text) =>
		text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1"),
	);
}

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
					.match(/\[([^\]]+)\]\(([^\)]+)\)$/);
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
