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

1. Deploy AcademyClassList
2. Deploy AcademyProjectList
3. Deploy AcademyStudents, using addressProjectList
4. grantRole for AcademyClassList in AcademyStudents
5. In AcademyClassList, createAcademyClass (addressStudentList, className)
6. In AcademyProjectList, addProject "Name"
7. Deploy MasterName, using addressStudentList. 
8. In AcademyProjectList, updateProjectByName => update the MasterName address

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
Use the file deploy_network.js located in folder `migrations-TESTs`.

Copy the file of your choice for the folder `migrations`, 
but be sure that you only have one of these files in `migrations`.

The folder `migrations-TESTs` has these files:
- deploy_locally.js => to deploy locally
- deploy_network.js => to deploy on network


