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


  //StudentSol subscribe class01 => AcademyClass.subscribe class01
  console.log("\n\nStudentSol AcademyClass.subscribe");
  await class01.subscribe({from: StudentSol});

  studentInClass = await class01.getStudentByAddress(StudentSol);
  console.log("\n studentInClass class01\n", studentInClass);
  student = await academyStudents.getStudentByAddress(StudentSol);
  console.log("\n student info\n", student);


  //StudentSol subscribe class02 => AcademyClass.subscribe class02
  console.log("\n\nAcademyClass.subscribe");
  await class02.subscribe({from: StudentSol});

  studentInClass = await class02.getStudentByAddress(StudentSol);
  console.log("\n studentInClass class02\n", studentInClass); 
  student = await academyStudents.getStudentByAddress(StudentSol);
  console.log("\n student info\n", student);   


  //Student academyStudents.updateActiveClass class01
  result = await academyStudents.updateActiveClass(class01.address, {from: StudentSol});
  //console.log("\n Student academyStudents.updateActiveClass result\n", result);
  console.log("\n\n class01.Address: ", class01.address);

  student = await academyStudents.getStudentByAddress(StudentSol);
  console.log("\n student info\n", student);

  //StudentSol submit NameSol.sol
  nameSol = await deployer.deploy(NameSol, {from: StudentSol});
  console.log("nameSol.Address: ", nameSol.address);
  console.log("nameSol.Address: ", await nameSol.getName());

  console.log("\nValidate project nameSol in Mastername");
  await masterName.addName(nameSol.address, "Solange Gueiros", {from: StudentSol});

  //StudentTalip submit NameTalip.sol
  nameTalip = await deployer.deploy(NameTalip, {from: StudentTalip});
  console.log("nameTalip.Address: ", nameTalip.address);  

  console.log("\nValidate project nameTalip in Mastername");
  await masterName.addName(nameTalip.address, "Talip Altas", {from: StudentTalip});


/*  
*/

  console.log("\n\n\n");
 
};
