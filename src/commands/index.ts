import { Plugin, Editor, MarkdownView } from "obsidian";
import { mergeDoubleNewLines, removeLinks } from "./my-command";
import { SampleModal } from "src/modal/sample_modal";

import { fun, editorFun } from "../types";
import { parseFunctionName } from "../utils/string_utils";

function command(id: string, name: string, callback: fun) {
	return { id, name, callback };
}
function cmd(plugin: Plugin, id: string, name: string, callback: fun) {
	plugin.addCommand(command(id, name, callback));
}
// 把函数名解析出 id, name, 再添加
function editorCmd(plugin: Plugin, callback: editorFun) {
	const { kebab, title } = parseFunctionName(callback);
	editorCmdFull(plugin, kebab, title, callback);
}
// 把 name 转换成 id, 再添加
function editorCmd2(plugin: Plugin, name: string, callback: editorFun) {
	const id = name
		.split(" ")
		.map((s) => s.toLowerCase)
		.join("-");
	editorCmdFull(plugin, id, name, callback);
}
function editorCmdFull(
	plugin: Plugin,
	id: string,
	name: string,
	callback: editorFun,
) {
	plugin.addCommand({
		id,
		name,
		editorCallback: (editor: Editor) => {
			callback(editor);
		},
	});
}
export function registerCommands(plugin: Plugin) {
	editorCmd2(plugin, "Merge Double Lines", mergeDoubleNewLines);
	editorCmd(plugin, removeLinks);

	registerCommandsDemo(plugin);
}

export function registerCommandsDemo(plugin: Plugin) {
	// This adds a simple command that can be triggered anywhere
	cmd(plugin, "open-modal", "Open modal", () => {
		new SampleModal(plugin.app).open();
	});
	// This adds an editor command that can perform some operation on the current editor instance
	plugin.addCommand({
		id: "sample-editor-command",
		name: "Sample editor command",
		editorCallback: (editor: Editor, _view: MarkdownView) => {
			console.log(editor.getSelection());
			editor.replaceSelection("Sample Editor Command");
		},
	});
	// This adds a complex command that can check whether the current state of the app allows execution of the command
	plugin.addCommand({
		id: "open-sample-modal-complex",
		name: "Open sample modal (complex)",
		checkCallback: (checking: boolean) => {
			// Conditions to check
			const markdownView =
				this.app.workspace.getActiveViewOfType(MarkdownView);
			if (markdownView) {
				// If checking is true, we're simply "checking" if the command can be run.
				// If checking is false, then we want to actually perform the operation.
				if (!checking) {
					new SampleModal(plugin.app).open();
				}

				// This command will only show up in Command Palette when the check function returns true
				return true;
			}
		},
	});
}
