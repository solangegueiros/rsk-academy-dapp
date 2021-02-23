const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const StudentPortfolio = artifacts.require("StudentPortfolio");
const MasterName = artifacts.require("MasterName");
const NameSol = artifacts.require("NameSol");
const NameTalip = artifacts.require("NameTalip");
const Name = artifacts.require("Name");
const MasterQuote = artifacts.require("MasterQuote");
const Quote = artifacts.require("Quote");

/*
This migration on Testnet for tests

*/


module.exports = async (deployer, network, accounts) => {

  if (network != "testnet") {
    console.log ("\n WRONG NETWORK! \n not deployed on: ", network, "\n\n\n");
    //return;
  }  
  console.log ("\n network: ", network, "\n\n");

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  console.log ("\n accounts: \n", accounts, "\n");
  console.log ("academyOwner: ", academyOwner);
  console.log ("StudentSol: ", StudentSol);
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  academyClassListAddress = '0x0658fA4678C2D1d1c8931B50153Ca8D59e24C962';
  academyClassList = await AcademyClass.at(academyClassListAddress);
  console.log("academyClassList.address: ", academyClassList.address);

  academyProjectListAddress = '0x4132B169B7CC3b09a4996D33AdcB6f580B9b321f';
  academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);

  academyStudentsAddress = '0x4D6eE9d3901C1b2856d2686Dd12DEa05B036a81e';
  academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  class01Address = '0xCD02E631A84d3469f9Bc7dCA6C2Def3ba3fCC368';
  class01 = await AcademyClass.at(class01Address);
  console.log("class01.address: ", class01.address);

  class02Address = '0x5C5728f005F368c3be01D892ea02FA0d3cb9c768';
  class02 = await AcademyClass.at(class02Address);
  console.log("class02.address: ", class02.address);   

  //In AcademyProjectList, addProjects
  console.log("academyProjectList.addProject Name");
  await academyProjectList.addProject("Name","Your name stored in a smart contract", {from: academyOwner});
  
  console.log("academyProjectList.addProject Pig Bank");
  await academyProjectList.addProject("Pig Bank","smart contract to save economies", {from: academyOwner});
  
  console.log("academyProjectList.addProject Token");
  await academyProjectList.addProject("Token","Mintable token ERC20", {from: academyOwner});
  //await academyProjectList.addProject("CRUD","A basic database to Create Read Update Delete", {from: academyOwner});
  //await academyProjectList.addProject("Photo Album","Photos stored in IPFS and hashes in a smart contract", {from: academyOwner});

  //Deploy MasterName
  nameProject = "Name";
  masterName = await deployer.deploy(MasterName, academyStudents.address, {from: academyOwner});
  console.log("masterName.Address: ", masterName.address);


/*  
*/

  console.log("\n\n\n");
 
};
