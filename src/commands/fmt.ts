import { pathToRegexp } from 'path-to-regexp'
import { readDirRecursive, readPhpConfig } from '../lib/utils'
import path from 'node:path'
import prettier from 'prettier'
import fs from 'node:fs/promises'
import * as prettierPluginPhp from '@prettier/plugin-php'

export const fmtCommand = async () => {
    const phpConfig = await readPhpConfig()

    const ignoredFiles = phpConfig.phx.fmt.ignoredFiles.map((item) =>
        path.join(process.cwd(), item)
    )

    const files = (await readDirRecursive(process.cwd())).filter((item) =>
        ignoredFiles.every((ignoredItem) => {
            return (
                !item.match(pathToRegexp(ignoredItem)) && ignoredItem !== item
            )
        })
    )

    for (const file of files) {
        const ext = file.split('.')[file.split('.').length - 1]

        let loader = ''

        switch (ext) {
            case 'html':
            case 'htm':
                loader = 'html'
                break

            case 'json':
                loader = 'json'
                break

            case 'css':
                loader = 'css'
                break

            case 'scss':
                loader = 'scss'
                break

            case 'md':
                loader = 'markdown'
                break

            case 'mdx':
                loader = 'mdx'
                break

            case 'json5':
                loader = 'json5'
                break

            case 'ts':
                loader = 'typescript'
                break

            case 'vue':
                loader = 'vue'
                break

            case 'yaml':
            case 'yml':
                loader = 'yaml'
                break

            case 'js':
                loader = 'babel'
                break

            case 'php':
                loader = 'php'

            default:
                break
        }

        await fs.writeFile(
            file,
            await prettier.format((await fs.readFile(file)).toString(), {
                plugins: [prettierPluginPhp],
                parser: loader,
                ...phpConfig.phx.fmt
            })
        )

        console.log(`FMT LOG: ${file}`)
    }
}
