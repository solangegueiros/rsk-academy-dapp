const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");

/*
This migration on Testnet for tests

   Deploying 'AcademyClassList'
   ----------------------------

Error:  *** Deployment Failed ***

"AcademyClassList" -- Unknown Error: {"jsonrpc":"2.0","id":5121065185459693,"error":{"code":-32010,"message":"the sender account doesn't exist"}}

{
  "originalError": {}
}.
*/


module.exports = async (deployer, network, accounts) => {

  if (network != "testnet") {
    console.log ("\n WRONG NETWORK! \n not deployed on: ", network, "\n\n\n");
    //return;
  }  
  console.log ("\n network: ", network, "\n\n");

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  console.log ("\n accounts: \n", accounts);
  console.log ("academyOwner: ", academyOwner);
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //Deploy AcademyClassList
  await deployer.deploy(AcademyClassList, {from: academyOwner});
  academyClassList = await AcademyClassList.deployed();
  academyClassListAddress = academyClassList.address;
  console.log("academyClassList.address: ", academyClassListAddress);

  //Deploy AcademyProjectList
  academyProjectList = await deployer.deploy(AcademyProjectList, {from: academyOwner});
  console.log("academyProjectList.address: ", academyProjectList.address);

  //Deploy AcademyStudents, using addressProjectList
  academyStudents = await deployer.deploy(AcademyStudents, academyProjectList.address, {from: academyOwner});
  console.log("academyStudents.address: ", academyStudents.address);

  //grantRole for AcademyClassList in academyStudents
  console.log("grantRole for AcademyClassList in academyStudents");
  //"0x0000000000000000000000000000000000000000000000000000000000000000","0x0fC5025C764cE34df352757e82f7B5c4Df39A836"
  academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: academyOwner});

  //AcademyClassList.createAcademyClass
  console.log("AcademyClassList.createAcademyClass (addressStudentList, className)");
  className = "Devs 2021-01";
  class01 = await academyClassList.createAcademyClass(academyStudents.address, className, {from: academyOwner});
  //console.log(JSON.stringify(class01));
  class01Address = await class01.logs[2].args[0];
  class01 = await AcademyClass.at(class01Address);
  console.log("class01Address: ", class01Address);
  console.log("class01.Address: ", class01.address);
  
  //Is class01 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 role ", result);

  //AcademyClassList.createAcademyClass
  console.log("AcademyClassList.createAcademyClass (addressStudentList, className)");
  className = "Business 2021-02";
  class02 = await academyClassList.createAcademyClass(academyStudents.address, className, {from: academyOwner});
  //console.log(JSON.stringify(class01));
  class02Address = await class02.logs[2].args[0];
  class02 = await AcademyClass.at(class02Address);
  console.log("class02Address: ", class02Address);
  console.log("class02.Address: ", class02.address);  

  console.log("\n\n\n");
 
};
