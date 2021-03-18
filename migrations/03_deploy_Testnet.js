/*
This migration file is to be used in a network.
It creates all structure, including:
- 1 project in AcademyProjectList: "Name"
- 1 class: 
    class01 = "Devs 2021-01"

SEED V2: jaguar recipe oval ecology woman misery firm dutch payment hero symbol radar
SEED V3: arrow fortune talk evolve palm wrist bleak silver raccoon bounce cat uphold
*/

const AcademyWallet = artifacts.require("AcademyWallet");
const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const AcademyStudentQuiz = artifacts.require("AcademyStudentQuiz");
const MasterName = artifacts.require("MasterName");
const StudentPortfolio = artifacts.require("StudentPortfolio");
const NameSol = artifacts.require("NameSol");
const Name = artifacts.require("Name");
const MasterQuote = artifacts.require("MasterQuote");
const Quote = artifacts.require("Quote");

module.exports = async (deployer, network, accounts) => {

  //accountStudent = accounts[1];
  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  console.log ("\n accounts: \n", accounts, "\n");
  console.log ("academyOwner: ", academyOwner);
  console.log ("StudentSol: ", StudentSol);  
  console.log ("StudentTalip: ", StudentTalip); 
  console.log ("StudentOther: ", StudentOther); 
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //Deploy AcademyWallet
  await deployer.deploy(AcademyWallet, {from: academyOwner});
  academyWallet = await AcademyWallet.deployed();
  console.log("academyWallet.address", academyWallet.address);

  //Deploy AcademyProjectList
  //await deployer.deploy(AcademyProjectList, {from: accounts[0]});
  //academyProjectList = await AcademyProjectList.deployed();
  academyProjectListAddress = '0x93B6D036e593f3c31C4c8b123c581F776524233b';
  academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //Deploy AcademyStudents, using addressProjectList
  //academyStudents = await deployer.deploy(AcademyStudents, academyProjectList.address, {from: accounts[0]});
  academyStudentsAddress = '0x8B61659F5166B7E290cEbB1c9ae61b8C81D4850E';
  academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  //revokeRole for OLD AcademyClassList in academyStudents
  //TODO: Deactivate OLD classes

  //Deploy AcademyClassList
  //academyClassList = await deployer.deploy(AcademyClassList, {from: accounts[0]});
  //academyClassList = await AcademyClassList.deployed();
  academyClassListAddress = '0xB2510CC85f359BAA45B4af24442E339B80450B64';
  academyClassList = await AcademyClassList.at(academyClassListAddress);
  console.log("academyClassList.address: ", academyClassList.address);

  //grantRole for AcademyClassList in academyStudents
  //console.log("grantRole for AcademyClassList in academyStudents");
  //await academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudents?
  console.log("Is AcademyClassList admin in academyStudents?");
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudents", result);

  //Deploy AcademyStudentQuiz
  //academyStudentQuiz = await deployer.deploy(AcademyStudentQuiz, {from: accounts[0]});
  academyStudentQuizAddress = '0x9C092457403Ce334cCDd14dC136A046F434f7EaC';
  academyStudentQuiz = await AcademyStudentQuiz.at(academyStudentQuizAddress);  
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);

  //grantRole for AcademyClassList in AcademyStudentQuiz
  //console.log("\ngrantRole for AcademyClassList in AcademyStudentQuiz");
  //await academyStudentQuiz.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudentQuiz?
  console.log("Is AcademyClassList admin in academyStudentQuiz?");
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudentQuiz", result);  


  //In AcademyProjectList, addProject "Name"
  //console.log("In AcademyProjectList, addProject Name");
  //await academyProjectList.addProject("Name","Your name stored in a smart contract", {from: accounts[0]});

  //Deploy MasterName
  nameProject = "Name";
  //masterName = await deployer.deploy(MasterName, academyStudents.address, {from: accounts[0]});
  masterNameAddress = '0x794247ADa39C572f6756118B9c1Df88860b96cFE';
  masterName = await MasterName.at(masterNameAddress);   
  console.log("masterName.Address: ", masterName.address);

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("\nproject\n", project);  
  console.log("project.master", project.master);
  console.log("Update Master in Project Name");
  //await academyProjectList.updateProjectByName(project.name, project.active, masterName.address, project.description, project.ABI);

 
  //AcademyClassList.createAcademyClass
  className = "Devs 2021-01";
  console.log("\nAcademyClassList.createAcademyClass (addressStudentList, className) ", className);
  console.log("\n", academyStudents.address, academyStudentQuiz.address, className);
  //class01 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: accounts[0]});
  //console.log("OK\n", JSON.stringify(class01.logs));
  //class01Address = await class01.logs[3].args[0];
  class01Address = '0xe9c79c9226e2cD36C09b1404825B7381240311bA';

  class01 = await AcademyClass.at(class01Address);
  console.log("class01Address: ", class01Address);
  console.log("class01.Address: ", class01.address);

  //Is class01 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 admin in academyStudents", result);

  //Is class01 admin in AcademyStudentQuiz?
  console.log("Is class01 admin in academyAcademyStudentQuiztudents?");
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 admin in academyStudentQuiz", result);  

  
  //AcademyClassList.createAcademyClass
  className = "Business 2021-01";
  console.log("\nAcademyClassList.createAcademyClass (addressStudentList, className) ", className);
  console.log("\n", academyStudents.address, academyStudentQuiz.address, className);
  //class02 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: accounts[0]});

  //console.log("OK\n", JSON.stringify(class02.logs));
  //class02Address = await class02.logs[3].args[0];
  class02Address = '0x406657dC292E080f4c919b573f4A774773860adb';

  class02 = await AcademyClass.at(class02Address);
  console.log("class02Address: ", class02Address);
  console.log("class02.Address: ", class02.address);

  //Is class02 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class02.address);
  console.log("class02 admin in academyStudents", result);

  //Is class02 admin in AcademyStudentQuiz?
  console.log("Is class02 admin in academyAcademyStudentQuiztudents?");
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, class02.address);
  console.log("class02 admin in academyStudentQuiz", result);  

  
/*  
*/

console.log("\n\n\n");

};
