# Advent of Code 2023 [Typescript]

## How to run script from shell

### 1. Install dependencies

```
npm i
```

### 2. Provide input puzzle

Every day needs to found its input puzzle in `folder_number/input.txt` (e.g. `01/input.txt`).

### 3. Run with `tsx` (zero config typescript for node)

From root folder of the project, run the `main.ts` file in each day folder, for instance, for day 1:

```
npx tsx 01/main.ts
```

## Debug

Options to launch the scripts in debug:

#### 1. `Launch Program`

Defined in `.vscode/launch.json`, you need to specify there the file to debug. It produce `out/main.js`. It auto focus the terminal tab, that contains no useful output, console log are in `DEBUG CONSOLE` tab.

### 2. `tsx`

Defined in `.vscode/launch.json`, it launch the current opened file, output is promted in the integrated terminal/

## Test

