import { Editor } from "obsidian";

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
