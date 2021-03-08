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

## RSK Testnet addresses - deployed smart contracts

```
academyOwner: 0xD046b0b7DD1d15C84eE0733E085045B040db0b03
academyWallet: 0x91976be9cAFCd18BE7b29580fa783Db92548b79d //TODO deploy for new owner

academyProjectList.address: 0x080c4cBb2b107ecEB49D6ebed39Aa18DB262C758
academyStudents.address: 0x82c7E2534A6d69165fCc0552535907f11D6ed0a9
academyClassList.address: 0xf10A7106f7b3Ef3a933a6E177f6871Bad86a9606
academyStudentQuiz.address: 0x9792E3660B9CE434e4c777f2815968b9d9607168
class01.address: 0x2dD6Ce85e5d9A92CBCA9a5d2A306dEbe52496E76
masterName.Address: 0xf69E3FD43BD9Ba6ba0ec31c0dCFA35Cb3A67dBD9
class02.address: 0xe9b9a72b3fea9fa30c8881f4dbdf95ca9e73160f


masterQuote.Address: 0xBc4C2c6218Ab998bE51491C841DAcfD154879f04
nameSol.Address: 0x3F9AC1D1d05C5efe309E71C5741dAA35Bd67c62b
nameTalip.Address: 0x5E5C3F2D170E0dE287414c08C74A5De8EDCeB2A0
quoteSol.Address:  0x952f4F0c10D633E3FcD4691F977Aa5D2A146618D
quoteTalip.Address:  0xCEe6544b1f9eF2C1412bf0A615831cDb1BE0e8f7
```


## Goerli Testnet addresses - deployed smart contracts

```
academyProjectList.address: 0xECf3BB2f2c7571d67bbcb4738B16ACfE9F3E21D0
academyStudents.address: 0x681c4987655f1d2e4335B70bc79C4FE8213d5E81
academyClassList.address: 0x4502Ce0c6cf7c3e5f5992e9b7F79E0c5C151d63e
academyStudentQuiz.address: 0x996BECf5278d512554fD3cd4d127C8D3085Db88E
class01.address: 0x97fCb0189d34ec7EC7c2FD3890e8cEe34C17F598
class02.address: 0xB6f4F955a344764811012bf59B14B01a6AaaBf22
```

```
academyProjectList.address: 
academyStudents.address: 
academyClassList.address: 
academyStudentQuiz.address:
class01.address: 
class02.address: 
```

Attemp 1
```
academyProjectList.address: 0x080c4cBb2b107ecEB49D6ebed39Aa18DB262C758
```

Attemp 2
```
academyProjectList.address: 0x82c7E2534A6d69165fCc0552535907f11D6ed0a9
academyStudents.address: 0xf10A7106f7b3Ef3a933a6E177f6871Bad86a9606
academyClassList.address: 0x2bd4e5cbc2e646bD1A52114D109985235dCeBeC0
academyStudentQuiz.address: 0x885E58c2d2E4f3237A01681279e816Ff8bC9eaAC
```

Attempt 3
```
academyProjectList.address: 0xbBc7e9031A0dE58843dEBFdd8d75Fb90a6c6FbC4
academyStudents.address: 0x155A8d3B9B46c9E1A624E13397A35A9F65e9fd17
academyClassList.address: 0xa0f6C5E64B4144C4819C3260D387411bF4c0e948
academyStudentQuiz.address: 0x2808308522C0463361fCC8bf2FC3E71e7d41C1b7
```

Attempt 4
```
academyProjectList.address: 0xbBc7e9031A0dE58843dEBFdd8d75Fb90a6c6FbC4
academyStudents.address: 0x155A8d3B9B46c9E1A624E13397A35A9F65e9fd17
academyClassList.address: 0xa0f6C5E64B4144C4819C3260D387411bF4c0e948
academyStudentQuiz.address: 0x2808308522C0463361fCC8bf2FC3E71e7d41C1b7
class01.address: 0xfd3524e6AB58F246F9DFB4F5B64d7E70d4346f0c
```

Attempt 5
```
academyProjectList.address: 0xE44DEaCb69D45D9F50Ac1e2E96CcbEF22b33A540
academyStudents.address: 0xfa5B113281a958887ba0Dd0D7993a62714549894
academyClassList.address: 0x9BfEf69b4E77a1a06E3683e0Eb6C701f0fEEF7Bb
academyStudentQuiz.address: 0x98B8269c1E30DdA410DA904462948183D6CCD6D0
```

Attempt 6
```
academyProjectList.address: 0xf6eF244EFA16Dd14FD58E4413C1F5aA7712E7825
academyStudents.address: 0x04644D29801938aa8609Bd91Cdef455232d114B3
academyClassList.address: 0x2321Fb01eFBbc746fc6B7f0Ca349B5a4B9ceA4d5
academyStudentQuiz.address: 0xc782197eBE5912daB9F05C072E45B1ada301EF4B
```

Attempt 7
```
academyProjectList.address: 0xECf3BB2f2c7571d67bbcb4738B16ACfE9F3E21D0
academyStudents.address: 0x681c4987655f1d2e4335B70bc79C4FE8213d5E81
academyClassList.address: 0x4502Ce0c6cf7c3e5f5992e9b7F79E0c5C151d63e
academyStudentQuiz.address: 0x996BECf5278d512554fD3cd4d127C8D3085Db88E
```