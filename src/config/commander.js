import { Command } from "commander"

const command = new Command()

command
.option('-d, --debug', 'variable para debug', false)
.requiredOption('--persistence <persistence>', 'persistencia')
.requiredOption('--env <enviroment>', 'entorno')
command.parse()

export const opts = command.opts()