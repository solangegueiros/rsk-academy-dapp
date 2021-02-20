# rsk-academy-dapp

```shell
npm i
truffle develop
migrate --reset
```

Arquitetura mais simples

1. Deploy AcademyClassList
2. Deploy AcademyProjectList
3. Deploy AcademyStudents, using addressProjectList
4. grantRole for AcademyClassList
5. In AcademyClassList, createAcademyClass (addressStudentList, className)
6. In AcademyProjectList, addProject "Name"
7. Deploy MasterName, using addressStudentList. 
9. In AcademyProjectList, updateProjectByName => update MasterName address
10. 


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











