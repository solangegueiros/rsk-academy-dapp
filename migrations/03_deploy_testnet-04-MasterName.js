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
const StudentPortfolio = artifacts.require("StudentPortfolio");

const MasterName = artifacts.require("MasterName");
const Name = artifacts.require("Name");
const NameSol = artifacts.require("NameSol");
const NameTalip = artifacts.require("NameTalip");

const MasterQuote = artifacts.require("MasterQuote");
const Quote = artifacts.require("Quote");

module.exports = async (deployer, network, accounts) => {

  //accountStudent = accounts[1];
  const [academyOwner, studentSol, studentTalip, studentOther] = accounts;
  console.log ("\n accounts: \n", accounts, "\n");
  console.log ("academyOwner: ", academyOwner);
  console.log ("studentSol: ", studentSol);  
  console.log ("studentTalip: ", studentTalip); 
  console.log ("studentOther: ", studentOther); 
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //Deploy AcademyProjectList
  //academyProjectList = await deployer.deploy(AcademyProjectList, {from: accounts[0]});
  academyProjectListAddress = '0x080c4cBb2b107ecEB49D6ebed39Aa18DB262C758';
  academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //Deploy AcademyStudents, using addressProjectList
  //academyStudents = await deployer.deploy(AcademyStudents, academyProjectList.address, {from: accounts[0]});
  academyStudentsAddress = '0x82c7E2534A6d69165fCc0552535907f11D6ed0a9';
  academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  //Deploy AcademyClassList
  //academyClassList = await deployer.deploy(AcademyClassList, {from: accounts[0]});
  academyClassListAddress = '0xf10A7106f7b3Ef3a933a6E177f6871Bad86a9606';
  academyClassList = await AcademyClassList.at(academyClassListAddress);
  console.log("academyClassList.address: ", academyClassList.address);

  //Deploy AcademyStudentQuiz
  //academyStudentQuiz = await deployer.deploy(AcademyStudentQuiz, {from: accounts[0]});
  academyStudentQuizAddress = '0x9792E3660B9CE434e4c777f2815968b9d9607168';
  academyStudentQuiz = await AcademyStudentQuiz.at(academyStudentQuizAddress);  
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);

  //Deploy MasterName
  nameProject = "Name";
  masterNameAddress = '0xbD74d3A253C512cc74154400308efac3AF474AF6';
  masterName = await MasterName.at(masterNameAddress);  
  //masterName = await deployer.deploy(MasterName, academyStudents.address, {from: academyOwner});
  console.log("masterName.Address: ", masterName.address);

  project = await academyProjectList.getProjectByName(nameProject);
  //console.log("\nproject\n", project);  
  //console.log("project.master", project.master);
  console.log("Update Master in Project Name");
  await academyProjectList.updateProjectByName(project.name, project.active, masterName.address, project.description, project.ABI);

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("\nproject AFTER\n", project);

/*
  //NameSol
  //nameSol = await deployer.deploy(NameSol, {from: studentSol});
  nameSolAddress = '0x9bFb0254E6C068E5aEA9f4FC9B6FFe62FdC74A7e';
  nameSol = await Name.at(nameSolAddress); 
  console.log("nameSol.Address: ", nameSol.address);

  console.log("\nValidate project NameSol in Mastername");
  await masterName.addName(nameSol.address, "Solange Gueiros", {from: studentSol});

  console.log("\nacademyStudents.getStudentByAddress");
  student = await academyStudents.getStudentByAddress(studentSol);
  console.log("\n student\n", student);  

  portfolio = await StudentPortfolio.at(student.portfolioAddress);
  console.log("portfolio.Address: ", portfolio.address);

  result = await portfolio.listPortfolio();
  console.log("\n portfolio\n", result);   
  

  //Name Talip
  nameTalip = await deployer.deploy(NameTalip, {from: studentTalip});
  //nameTalipAddress = '0x020028b5D57E7324ff2bc021f284F344ED47b889';
  //nameTalip = await Name.at(nameTalipAddress);  
  console.log("nameTalip.Address: ", nameTalip.address);

  console.log("\nValidate project Name in MasterName");
  await masterName.addName(nameTalip.address, "Talip Altas", {from: studentTalip});  

/*  
*/

console.log("\n\n\n");

};
