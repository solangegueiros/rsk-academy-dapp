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

### Truffle develop
To develop locally, I'm using only the `truffle develop` environment.

> Truffle develop environment is a blockchain simulator, so you don't need to run a node when use `truffle develop` 

Verify if exists the file .secret
If don't exists, create it. It can be empty when you are using truffle develop. 

```shell
truffle develop
migrate --reset
```

## Run the dApp frontend

```shell
cd app
```

In the first time:

```shell
cd app
```

to run the dApp:

```shell
npm run start
```

In your webwallet, use the same mnemonic from truffle develop.

## Extra information

### Deploy sequence

1. Deploy AcademyProjectList
2. Deploy AcademyStudents, using addressProjectList
3. Deploy AcademyClassList 
4. grantRole for AcademyClassList in AcademyStudents
5. In AcademyProjectList, addProject "Name"
6. Deploy MasterName, using addressStudentList. 
7. In AcademyProjectList, updateProjectByName => update the MasterName address
8. In AcademyClassList, createAcademyClass (addressStudentList, className)

## TODO: Active course

- Only after subscribe... think the best moment to check this.

When the student chooses a course in the course menu, the active AcademyClass is saved in a global variable.

When the student connects his wallet, his activeClass is checked.

If AcademyClass for the selected course is different from activeClass, it will display this message:
The active course is: XXX
The selected course is YYY

Your active course is XXX, but you selected the YYY course in menu.
You need to change one or other.


No futuro: 
verifica se o estudante está inscrito no curso ativo
  - Se tiver, pergunta se quer trocar o curso ativo.
ou
- Pergunta se quer se inscrever no curso selecionado
ou
- Pergunta se quer ir para o curso ativo

Seleciona um curso.
- O estudante tem uma wallet => subscribe in AcademyClass

# Smart contract Name

1. The student develop and publish his smart contract Name 
2. In MasterName, addName 
4. List your portfolio
5. Check his smart contract Name
6. He forgot to update "your name", so in MasterName, run deleteProjectByAddress

MasterName calls Portfolio.deleteProjectByAddress


## Course completed

When a student finish a course?

The last project will have which projects must be done in order to complete the course.
When the student submit the last project, it will call AcademyClass.courseComplete

Then it will generate a certificate registered in Blockchain

> TODO


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


### V3 Wrong

academyProjectList with projects!

```
academyProjectList.address: 0x95ce912A875E4b68F5eF3c761eABF625D84DDb12 
academyStudents.address: 0xaF3F20347f455edBD79d90a03f75193f3a3Daec3
academyClassList.address: 0x1762a9E9567bd46E71C2aA5626e87De7C1665741
```