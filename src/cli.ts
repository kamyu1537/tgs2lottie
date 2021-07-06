#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { convert } from './index';

(async () => {
    const argv = await yargs(hideBin(process.argv))
        .usage('Usage: $0 [--resize=512] <filepath>')
        .option('resize', { desc: 'change sticker size', default: 512 })
        .example('$0 --resize=320 ./AnimatedSticker.tgs', 'Convert AnimatedSticker.tgs to 320 size Lottie animation json')
        .argv;

    const filepath = argv._[0] || undefined;
    if (!filepath) {
        console.log(chalk.yellow('⚠  filepath is required!!'));
        return;
    }

    let resize: number = Number(argv.resize as number) || 512;
    if (!Number.isInteger(resize)) resize = 512;

    try {
        const p = path.parse(filepath as string);
        const tgs = fs.readFileSync(filepath as string);
        const json = convert(tgs, resize);
    
        fs.writeFileSync(path.join(p.dir, p.name + '_' + resize + '.json'), json);
    } catch (err) {
        console.log(chalk.red('❌', err.message));
    }
})();