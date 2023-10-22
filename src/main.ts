import Yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import chalk from 'chalk'
import { initCommand } from './commands/init'
import { fmtCommand } from './commands/fmt'
import { addCommand } from './commands/add'

const args: string[] = (Yargs(hideBin(process.argv)).argv as unknown as any)._

switch (args[0]) {
    case 'add':
        await addCommand()
        break

    case 'fmt':
        await fmtCommand()
        break

    case 'init':
        await initCommand()
        break

    default:
        console.log(
            chalk.red(`The requested command "${args[0]}" does not exist!`)
        )
        break
}
