import * as prettier from 'prettier'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToRegexp } from 'path-to-regexp'
import chalk from 'chalk'

export const tidy = async (text: string, options: prettier.Options) => {
    return await prettier.format(text, options)
}

export const parseRepoName = (text: string) => {
    let parsed = text

    return parsed
}

export const readDirRecursive = async (dir: string): Promise<string[]> => {
    const filepaths = await fs.readdir(dir)

    let files: string[] = []
    let dirs: string[] = []
    for (const filepath of filepaths) {
        const stats = await fs.stat(path.join(dir, filepath))
        if (stats.isDirectory()) {
            dirs.push(path.join(dir, filepath))
        } else {
            files.push(path.join(dir, filepath))
        }
    }

    for (const dir of dirs) {
        files.push(...(await readDirRecursive(dir)))
    }

    return files
}

export const parseToAbsolute = (relativePath: string) =>
    path.join(process.cwd(), relativePath)

// all absolute paths are required
export const isIgnored = (file: string, ignores: string[]) => {
    let isMatched = false

    for (const ignore of ignores) {
        const regexp = pathToRegexp(ignore)

        if (file.match(regexp)) {
            isMatched = true
            break
        }
    }

    return isMatched
}

export type PhpConfig = {
    description: string
    phx: {
        fmt: {
            ignoredFiles: string[]
        }
    }
}
export const readPhpConfig = async (): Promise<PhpConfig> => {
    const phpConfigPath = path.join(process.cwd(), 'php.json')

    if (!(await fs.exists(phpConfigPath))) {
        console.log(
            chalk.red(
                'The php.json file does not exist. Please create a new one!'
            )
        )
        process.exit(1)
    }

    const raw = await fs.readFile(phpConfigPath)

    return JSON.parse(raw.toString()) as PhpConfig
}
