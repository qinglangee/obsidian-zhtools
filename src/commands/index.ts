import { Plugin, Editor, MarkdownView } from "obsidian";
import { mergeDoubleNewLines } from "./my-command";
import { SampleModal } from "src/modal/sample_modal";

import { fun } from "../types";

function command(id: string, name: string, callback: fun) {
	return { id, name, callback };
}
function cmd(plugin: Plugin, id: string, name: string, callback: fun) {
	plugin.addCommand(command(id, name, callback));
}
export function registerCommands(plugin: Plugin) {
	plugin.addCommand({
		id: "merge-double-newlines",
		name: "Merge Double Newlines",
		editorCallback: (editor: Editor) => {
			mergeDoubleNewLines(editor);
		},
	});

	// This adds a simple command that can be triggered anywhere
	cmd(
		plugin,
		"open-sample-modal-simple",
		"Open sample modal (simple)22",
		() => {
			new SampleModal(plugin.app).open();
		},
	);
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

export function registerIcons(plugin: Plugin) {}
