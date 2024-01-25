import { Command } from "commander"

const command = new Command()

command.option('-d, --debug', 'variable para debug', false)
.option('--persistence <persistence>', 'persistencia')
command.parse()

export const opts = command.opts()