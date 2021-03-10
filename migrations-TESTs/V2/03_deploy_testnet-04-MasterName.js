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
  masterName = await deployer.deploy(MasterName, academyStudents.address, {from: academyOwner});
  console.log("masterName.Address: ", masterName.address);


/*  
*/

console.log("\n\n\n");

};
