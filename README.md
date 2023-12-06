## Run script from shell

```
npx ts-node --esm path_to_file
```

`--esm` is need because I have

```json
"type": "module"
```

in `package.json`

## Run with VScode debug

1. `Launch Program`

Defined in `.vscode/launch.json`, it produce `out/main.js`.\
Use to launch with breakpoint, but it auto focus the terminal tab, that contains no useful output, console log are in `DEBUG CONSOLE` tab.

2. `Run current File` [DO NOT USE]

[!IMPORTANT] it relies on what there is in `out/main.js`, without recompile it.
