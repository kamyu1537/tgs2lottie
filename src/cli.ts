#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { convert } from './index';

(async () => {
    const argv = await yargs(hideBin(process.argv))
        .example('$0 --size=320 ./AnimatedSticker.tgs', 'Convert AnimatedSticker.tgs to 320 size Lottie animation json')
        .alias('s', 'size')
        .describe('s', 'change sticker size')
        .default('s', 512)
        .nargs('s', 1)
        .command('<filepath> [--size=512]', '')
        .demandCommand()
        .argv;

    const filepath = argv._[0] + "";
    let size: number = argv.s == null ? 512 : argv.s;
    if (!Number.isInteger(size)) size = 512;

    try {
        const p = path.parse(filepath as string);
        const tgs = fs.readFileSync(filepath as string);
        const json = convert(tgs, size);

        fs.writeFileSync(path.join(p.dir, p.name + '_' + size + '.json'), json);
    } catch (err) {
        console.log(chalk.red('❌', err));
    }
})();
