# RSK academy dApp


## Develop locally

Run these commands:

```shell
git clone https://github.com/solangegueiros/rsk-academy-dapp.git
cd rsk-academy-dapp
npm i
```

### Migrations

In the folder `migrations`, be sure that you only have the file `deploy_locally.js` in the folder.

The folder `migrations-TESTs` has 2 files:

- deploy_locally.js => to deploy locally
- deploy_network.js => to deploy on network

Copy the file of your choice for the folder `migrations`, 
but be sure that you only have one of these files in `migrations`.

### Truffle develop
To develop locally, I'm using only the `truffle develop` environment.

Verify if exists the file .secret
If don't exists, create it. It can be empty when you are using truffle develop. 

```shell
truffle develop
migrate --reset
```



### Deploy sequence

1. Deploy AcademyClassList
2. Deploy AcademyProjectList
3. Deploy AcademyStudents, using addressProjectList
4. grantRole for AcademyClassList in AcademyStudents
5. In AcademyClassList, createAcademyClass (addressStudentList, className)
6. In AcademyProjectList, addProject "Name"
7. Deploy MasterName, using addressStudentList. 
8. In AcademyProjectList, updateProjectByName => update the MasterName address




No App
Quando o estudante escolhe um curso é salva qual a AcademyClass ativa

Quando o estudante conecta, é verificado a activeClass dele.

Se AcademyClass do curso selecionado é diferente da activeClass, apresenta mensagens:
O curso ativo é: XXX
O curso selecionado é YYY

Seu curso ativo é diferente do curso selecionado.

No futuro
Verifica se o estudante está inscrito no curso ativo
  Se tiver, pergunta se quer trocar o curso ativo.
ou
Pergunta se quer se inscrever no curso selecionado
ou
Pergunta se quer ir para o curso ativo


Seleciona um curso.
O estudante tem uma wallet => subscribe in AcademyClass

# Smart contract Name

1. O estudante faz seu smart contract Name
2. In MasterName, addName. 
4. Lista seu portfolio
5. Olha o Name
6. Esqueceu de atualizar seu "name", não gosta do resultado => in MasterName deleteProjectByAddress

MasterName chama Portfolio.deleteProjectByAddress


## Course completed

When a student finish a course?

The last project will have which projects must be done in order to complete the course.
When the student submit the last project, it will call AcademyClass.courseComplete

Then it will generate a certificate registered in Blockchain

> TODO










