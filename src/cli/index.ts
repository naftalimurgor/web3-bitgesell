#! /usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import jsbgl from '../lib';

// itinerary:
// 1. hookup mvp cli
// 2. types for jsbgl
// 3. currently testnet is supported, override with {testnet: true} and among other options
// 4. test(with coverage report)
// 5. demo(browser/nodejs) - would be useful to show usage
// 5. publish to npm
// 6. Report on discord and get paid

/**
 * `main` entry function for running the cli portion
 * All the commandline nitty-gritties are handled by @link https://github.com/tj/commander.js
 * Exposes:
 * - Wallet functionality
 * - Transactions functionality
 * - Address functionality
 */
async function main() {
  try {
    await jsbgl.asyncInit(globalThis);
  } catch (error) {
    chalk.yellow('E: Failed to initialize with', error);
  }

  const testnetRegegx = /^(Testnet|tesnet|TestNet|test net|testNet)$/i;

  const program = new Command();
  program
    .name('@bitgesell/web3/cli')
    .description(
      '@bitgesell/web3/cli, - A cli utility for interracting with the Bitgesell Blockchain Network'
    )
    .version('1.0.0');

  /**
   * Command for all the address related operations
   * @param network | tesnet or mainnet
   */
  program
    .command('address')
    .argument('--network')
    .argument('--address')
    .action((network: string) => {
      const isTesnet = testnetRegegx.test(network);

      if (isTesnet) {
        // initialize address class and create a testnet address
        // @ts-ignore: TODO: create type definitions for jsbgl module
        const address = new globalThis.Address({ testnet: true });
        console.log(address.wif);
        console.log(address.address);
        chalk.gray(`Address:`, address.wif);
        chalk.gray(`WIF:`, address.wif);
      } else {
        // initialize address class and create a testnet address
        // @ts-ignore: TODO: create type definitions for jsbgl module
        const address = new globalThis.Address();
        console.log(address.wif);
        console.log(address.address);
        chalk.gray(`Generated Address for Mainnet:`, address.wif);
        chalk.gray(`WIF For mainnet:`, address.wif);
      }

      /**
       * Command  for all the wallet related operations
       * @param network | tesnet or mainnet
       */
      program
        .command('wallet')
        .argument('--network')
        .action((network: string) => {
          const isTesnet = testnetRegegx.test(network);

          if (isTesnet) {
            // @ts-ignore: TODO: create type definitions for jsbgl module
            const wallet = new globalThis.Wallet({ path_type: 'BIP84' });
            console.log(wallet.wif);
            console.log(wallet.address);
            chalk.gray(`Address:`, wallet.wif);
            chalk.gray(`WIF:`, wallet.wif);
          } else {
            // initialize address class and create a testnet address
            // @ts-ignore: TODO: create type definitions for jsbgl module
            const wallet = new globalThis.Wallet({ path_type: 'BIP84' });
            console.log(wallet.wif);
            console.log(wallet.address);

            chalk.gray(`Wallet Mnemonic:`, wallet.Mnemonic); // write to fs as wallet.json {wif: pkey: adresses: mneomonic: }
            chalk.gray(`Wallet Private Key:`, wallet.wif);
          }
        });
    });

  // address
  // Wallet
  // Transactions

  program.parse();
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
