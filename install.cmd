set dest_dir= "d:\eachcloud\nut\nutsb\writes\.obsidian\plugins\obsidian-zhtools\"

for %%f in (main.js styles.css manifest.json) do (
    xcopy /Y "%%f" %dest_dir%
)
