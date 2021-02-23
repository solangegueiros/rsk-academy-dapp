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

  masterNameAddress = '0xD63483df344BD465f0509eAa6170Afaf87B32229';
  masterName = await MasterName.at(masterNameAddress);
  console.log("masterName.Address: ", masterName.address);

  masterQuoteAddress = '0xBc4C2c6218Ab998bE51491C841DAcfD154879f04';
  masterQuote = await MasterQuote.at(masterQuoteAddress);
  console.log("masterQuote.Address: ", masterQuote.address);

  nameProject = "Name";
  project = await academyProjectList.getProjectByName(nameProject);
  console.log("Update Master in Project Name");
  await academyProjectList.updateProjectByName(project.name, project.active, masterName.address, project.description, project.ABI);

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("\nproject AFTER\n", project, "\n");


  nameProject = "Quote";
  project = await academyProjectList.getProjectByName(nameProject);
  console.log("Update Master in Project Quote");
  await academyProjectList.updateProjectByName(project.name, project.active, masterQuote.address, project.description, project.ABI);

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("\nproject AFTER\n", project, "\n");
  


/*  
*/

  console.log("\n\n\n");
 
};
