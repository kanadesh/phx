import chalk from 'chalk'
import prompts from 'prompts'
import path from 'node:path'
import fs from 'node:fs/promises'
import { parseRepoName, tidy } from '../lib/utils'
import ora from 'ora'
import supercharge from '@supercharge/fs'
import degit from 'degit'

export const initCommand = async () => {
    const promptResponse = await prompts([
        {
            type: 'select',
            name: 'type',
            message: 'Select your project type',
            choices: [
                {
                    title: 'Skeleton project',
                    description: 'Start your project without any templates',
                    value: 'skeleton'
                },
                {
                    title: 'Using template',
                    description: 'Start your project with a great template',
                    value: 'template'
                }
            ]
        },
        {
            type: (prev) => (prev !== 'skeleton' ? 'text' : null),
            name: 'templateRepo',
            message: "Write template repo's git url"
        },
        {
            type: 'confirm',
            name: 'ready',
            message: 'Are you ready to dive?'
        }
    ])

    if (!promptResponse.ready) {
        console.log('')
        console.log(chalk.red('The initialization has canceled :('))
        return
    }

    const spinner = ora('Finding unicorn...').start()

    const cwd = process.cwd()
    const phpFilePath = path.join(cwd, 'php.json')

    if (promptResponse.type === 'skeleton') {
        if (await fs.exists(phpFilePath)) {
            const fileExistsResponse = await prompts({
                type: 'confirm',
                name: 'boolean',
                message: 'The php.json file already exists. Override?'
            })
            if (!fileExistsResponse.boolean) {
                console.log('')
                console.log(chalk.red('The initialization has canceled :('))
                return
            }
            await fs.rm(phpFilePath)
        }
        await fs.writeFile(
            phpFilePath,
            await tidy(
                JSON.stringify({
                    name: 'your_php_project',
                    description: 'Your php project is here! XD',
                    phx: {
                        fmt: {}
                    }
                }),
                { parser: 'json' }
            )
        )
    } else if (promptResponse.type === 'template') {
        if (!(await supercharge.isEmptyDir(cwd))) {
            const dirExistsResponse = await prompts({
                type: 'confirm',
                name: 'boolean',
                message: 'The current dir does not empty. Override?'
            })
            if (!dirExistsResponse.boolean) {
                console.log('')
                console.log(chalk.red('The initialization has canceled :('))
                return
            }
            await supercharge.emptyDir(cwd)
        }

        let gitUrl: string = parseRepoName(promptResponse.templateRepo)

        const emitter = degit(gitUrl)

        await emitter.clone(cwd)
    }

    spinner.stop()
    console.log('')
    console.log(chalk.green('The repository successfully initialized :)'))
    console.log(chalk.green('See this file: php.json'))
}
