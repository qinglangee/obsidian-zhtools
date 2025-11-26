import { Plugin, Notice } from "obsidian";

export function registerIconTools(plugin: Plugin) {
	// This creates an icon in the left ribbon.
	const ribbonIconEl = plugin.addRibbonIcon(
		"dice",
		"ZH Tools",
		(_evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice("Hello zhtools!");
		},
	);
	// Perform additional things with the ribbon
	ribbonIconEl.addClass("my-plugin-ribbon-class");
}
