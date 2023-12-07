## Run script from shell

### `ts-node`

```
npx ts-node --esm path_to_file
```

`--esm` is need because I have

```json
"type": "module"
```

in `package.json`

### `tsx` (zero config typescript for node)

- install with `npm i -D tsx`
- launch with `npx tsx path_to_file`

## Debug

### 1. `Launch Program`

Defined in `.vscode/launch.json`, you need to specify there the file to debug. It produce `out/main.js`. It auto focus the terminal tab, that contains no useful output, console log are in `DEBUG CONSOLE` tab.

### 2. `tsx`

Defined in `.vscode/launch.json`, it launch the current opened file, output is promted in the integrated terminal/
