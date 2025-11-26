import { Editor } from "obsidian";

export function mergeDoubleNewLines(editor: Editor) {
	// console.log(editor.getSelection());
	// editor.replaceSelection("Sample Editor Command");

	const content = editor.getValue(); // 取得全文
	const replaced = content.replace(/\n\n/g, "\n"); // 两个 newlines 替换为一个
	editor.setValue(replaced); // 设置全文
}
