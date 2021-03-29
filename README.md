# RSK academy dApp


## Develop locally

Run these commands:

```shell
git clone https://github.com/solangegueiros/rsk-academy-dapp.git
cd rsk-academy-dapp
npm i
truffle compile
```

In the folder `migrations`, be sure that you only have the file `deploy_locally.js` in the folder.

Maybe it is on folder `migrations-TESTs` and you need to move it.

### Truffle develop

To develop locally, I'm using only the `truffle develop` environment.

> Truffle develop environment is a blockchain simulator, so you don't need to run a node when use `truffle develop` 

Verify if exists the file .secret
If don't exists, create it. It can be empty when you are using truffle develop. 

```shell
truffle develop
migrate --reset
```

networkId: 5777

`truffle develop` create a mnemonic which you need to use on Metamask.

### Develop using Ganache-cli

Metamask on locaHost is forcing networkId 1337, 
and rLogin check the networkId so you need to use it.

Run on Terminal 1:

```shell
ganache-cli -i 1337 -m "virtual valve razor retreat either turn possible student grief engage attract fiber"
```

Run on Terminal 2:

```shell
truffle migrate --network development --skip-dry-run
```


## Run the dApp frontend

In your webwallet, use the same mnemonic from truffle develop / ganache-cli.


```shell
cd app
```

In the first time:

```shell
npm install
```

to run the dApp:

```shell
npm run start
```




## Deploy on Blockchain
truffle migrate --network testnet --skip-dry-run

Use the file deploy_network.js located in folder `migrations-TESTs`.

Copy the file of your choice for the folder `migrations`, 
but be sure that you only have one of these files in `migrations`.

The folder `migrations-TESTs` has these files:
- deploy_locally.js => to deploy locally
- deploy_network.js => to deploy on network




## RSK Testnet addresses V3 - deployed smart contracts

```
academyOwner: 0x2cf88b0D4b5C441941a743C5E8D184615b4DC075
academyWallet: 0x9DADdE7DDF79BF2e69A7Ed35DBC74141144d6B1C

academyProjectList.address: 0x93B6D036e593f3c31C4c8b123c581F776524233b
academyStudents.address: 0x8B61659F5166B7E290cEbB1c9ae61b8C81D4850E
academyClassList.address: 0xB2510CC85f359BAA45B4af24442E339B80450B64
academyStudentQuiz.address: 0x9C092457403Ce334cCDd14dC136A046F434f7EaC

masterName.Address: 0x794247ADa39C572f6756118B9c1Df88860b96cFE

Devs 2021-01 - class01.address: 0xe9c79c9226e2cD36C09b1404825B7381240311bA
Business 2021-01 - class02.address: 0x406657dC292E080f4c919b573f4A774773860adb
```
