import { Editor } from "obsidian";
import { getHeaderRange } from "src/utils/editor_utils";

/**
 * 修改标题等级：offset=+1（增加一级），offset=-1（减少一级）
 */
function modifyHeaderLevel(editor: Editor, offset: number) {
	const result = getHeaderRange(editor);
	if (!result) return;

	const { headerLine, endLine, lines } = result;
	// 保存光标
	const cursor = editor.getCursor();

	// 修改区间内标题等级
	for (let i = headerLine; i <= endLine; i++) {
		const line = lines[i];
		const m = line.match(/^(#+)\s+/);

		if (m) {
			const currentLevel = m[1].length;
			let newLevel = currentLevel + offset;

			// 限定范围：最小 1，最大 6
			newLevel = Math.max(1, Math.min(newLevel, 6));

			// 替换标题等级
			lines[i] = line.replace(/^(#+)/, "#".repeat(newLevel));
		}
	}

	// 写回编辑器
	const newText = lines.join("\n");
	editor.setValue(newText);
	// 恢复光标位置
	editor.setCursor(cursor);
}

/**
 * 标题及其子标题全部 +1 级
 */
export function addLevel(editor: Editor) {
	modifyHeaderLevel(editor, +1);
}

/**
 * 标题及其子标题全部 -1 级
 */
export function minusLevel(editor: Editor) {
	modifyHeaderLevel(editor, -1);
}
