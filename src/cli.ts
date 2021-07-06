#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { convert } from './index';

(async () => {
    const argv = await yargs(hideBin(process.argv))
        .usage('Usage:\ntgs2lottie [--resize=512] <filepath>\ntgs2lottie [--resize=512] --file=./AnimatedSticker.tgs')
        .example('tgs2lottie --resize=320 ./AnimatedSticker.tgs', 'Convert AnimatedSticker.tgs to 320 size Lottie animation json')
        .alias('s', 'resize')
        .describe('s', 'change sticker size')
        .default('s', 512)
        .nargs('s', 1)
        .command('<filepath> [--resize=512]', '')
        .demandCommand()
        .argv;

    const filepath = argv._[0];
    if (!filepath) {
        console.log(chalk.yellow('⚠  filepath is required!!'));
        return;
    }

    let resize: number = argv.s || 512;
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