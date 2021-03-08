/*
This migration file is to be used in a network.
It creates all structure, including:
- 1 project in AcademyProjectList: "Name"
- 1 class: 
    class01 = "Devs 2021-01"

NEW SEED: jaguar recipe oval ecology woman misery firm dutch payment hero symbol radar
*/

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

  //Deploy AcademyProjectList
  academyProjectList = await deployer.deploy(AcademyProjectList, {from: accounts[0]});
  //academyProjectListAddress = '0x080c4cBb2b107ecEB49D6ebed39Aa18DB262C758';
  //academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //Deploy AcademyStudents, using addressProjectList
  academyStudents = await deployer.deploy(AcademyStudents, academyProjectList.address, {from: accounts[0]});
  //academyStudentsAddress = '0x82c7E2534A6d69165fCc0552535907f11D6ed0a9';
  //academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  //revokeRole for OLD AcademyClassList in academyStudents
  //academyClassListAddress = '0x0658fA4678C2D1d1c8931B50153Ca8D59e24C962';
  //academyStudents.revokeRole(DEFAULT_ADMIN_ROLE, academyClassListAddress, {from: accounts[0]});
  //TODO: Deactivate OLD classes

  //Deploy AcademyClassList
  await deployer.deploy(AcademyClassList, {from: accounts[0]});
  academyClassList = await AcademyClassList.deployed();
  academyClassListAddress = academyClassList.address;
  console.log("academyClassList.address: ", academyClassListAddress);

  //grantRole for AcademyClassList in academyStudents
  //"0x0000000000000000000000000000000000000000000000000000000000000000","0x0fC5025C764cE34df352757e82f7B5c4Df39A836"
  console.log("grantRole for AcademyClassList in academyStudents");
  await academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudents?
  console.log("Is AcademyClassList admin in academyStudents?");
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudents", result);

  //Deploy AcademyStudentQuiz
  academyStudentQuiz = await deployer.deploy(AcademyStudentQuiz, {from: accounts[0]});
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);

  //grantRole for AcademyClassList in AcademyStudentQuiz
  console.log("\ngrantRole for AcademyClassList in AcademyStudentQuiz");
  await academyStudentQuiz.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudentQuiz?
  console.log("Is AcademyClassList admin in academyStudentQuiz?");
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudentQuiz", result);  


  //AcademyClassList.createAcademyClass
  className = "Devs 2021-01";
  console.log("\nAcademyClassList.createAcademyClass (addressStudentList, className) ", className);
  console.log("\n", academyStudents.address, academyStudentQuiz.address, className);
  class01 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: accounts[0]});

  console.log("OK\n", JSON.stringify(class01.logs));
  class01Address = await class01.logs[3].args[0];
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


  //In AcademyProjectList, addProject "Name"
  await academyProjectList.addProject("Name","Your name stored in a smart contract", {from: accounts[0]});

  //Deploy MasterName
  nameProject = "Name";
  masterName = await deployer.deploy(MasterName, academyStudents.address, {from: accounts[0]});
  console.log("masterName.Address: ", masterName.address);

  project = await academyProjectList.getProjectByName(nameProject);
  //console.log("\nproject\n", project);  
  //console.log("project.master", project.master);
  console.log("Update Master in Project Name");
  await academyProjectList.updateProjectByName(project.name, project.active, masterName.address, project.description, project.ABI);

  
/*  
*/

console.log("\n\n\n");

};
