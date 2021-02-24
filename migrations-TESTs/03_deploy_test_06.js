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

  nameSolAddress = '0x3F9AC1D1d05C5efe309E71C5741dAA35Bd67c62b';
  nameSol = await NameSol.at(nameSolAddress);
  console.log("nameSol.Address: ", nameSol.address);

  nameTalipAddress = '0x5E5C3F2D170E0dE287414c08C74A5De8EDCeB2A0';
  nameTalip = await NameTalip.at(nameTalipAddress);
  console.log("nameTalip.Address: ", nameTalip.address);  

  //Quote for StudentSol
  quoteSol = await deployer.deploy(Quote, {from: StudentSol});
  console.log("quoteSol.Address: ", quoteSol.address);
  result = await quoteSol.setQuote("Live as if you were to die tomorrow. Learn as if you were to live forever. ― Mahatma Gandhi");

  console.log("\nValidate project quoteSol in Master");
  await masterQuote.validate(quoteSol.address, {from: StudentSol});

  //Quote for StudentTalip
  quoteTalip = await deployer.deploy(Quote, {from: StudentTalip});
  console.log("quoteTalip.Address: ", quoteTalip.address);
  result = await quoteTalip.setQuote("Education is the most powerful weapon which you can use to change the world. – Nelson Mandela");

  console.log("\nValidate project quoteTalip in Master");
  await masterQuote.validate(quoteTalip.address, {from: StudentTalip});

/* The result:
  quoteSolAddress = ' 0x952f4F0c10D633E3FcD4691F977Aa5D2A146618D';
  quoteSol = await Quote.at(quoteSolAddress);
  console.log("quoteSol.Address: ", quoteSol.address);

  quoteTalipAddress = ' 0xCEe6544b1f9eF2C1412bf0A615831cDb1BE0e8f7';
  quoteTalip = await Quote.at(quoteTalipAddress);
  console.log("quoteTalip.Address: ", quoteTalip.address);

/*  
*/

  console.log("\n\n\n");
 
};
