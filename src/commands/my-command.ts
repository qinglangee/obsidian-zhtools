import { Editor } from "obsidian";

/**
 * 把编辑器的连续两个换行全部换成一个换行
 */
export function mergeDoubleNewLines(editor: Editor) {
	const content = editor.getValue(); // 取得全文
	const replaced = content.replace(/\n\n/g, "\n"); // 两个 newlines 替换为一个
	editor.setValue(replaced); // 设置全文
}

/**
 * 删除 markdown 中的所有 [text](url) 形式的链接
 * @param editor
 */
export function removeLinks(editor: Editor) {
	// 1. 获取当前内容
	const content = editor.getValue();

	// 2. 移除所有 Markdown 链接，仅保留文本部分
	const newContent = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

	// 3. 设置回编辑器
	editor.setValue(newContent);
}
