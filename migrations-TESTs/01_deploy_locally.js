const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const AcademyStudentQuiz = artifacts.require("AcademyStudentQuiz");
const StudentPortfolio = artifacts.require("StudentPortfolio");
const MasterName = artifacts.require("MasterName");
const NameSol = artifacts.require("NameSol");
const Name = artifacts.require("Name");
const MasterQuote = artifacts.require("MasterQuote");
const Quote = artifacts.require("Quote");

/*
This migration file is to be used locally.
It creates all structure, including:
- 3 projects in AcademyProjectList: "Name", "Pig Bank", "Token"
- a student: accounts[1]
- 2 classes: 
    class01 = "Devs 2021-01"
    class02 = "Business 2021-02"
- the student subscribe on 2 classes

User case: a student submit the name project, 
but he did a mistake, then delete it and submit again
*/



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
  //If I didn't do this in the first deploy, I didn't get the contract.address...
  academyProjectList = await AcademyProjectList.deployed();   
  //academyProjectListAddress = '0x080c4cBb2b107ecEB49D6ebed39Aa18DB262C758';
  //academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //Deploy AcademyStudents, using addressProjectList
  academyStudents = await deployer.deploy(AcademyStudents, academyProjectList.address, {from: accounts[0]});
  //academyStudentsAddress = '0x82c7E2534A6d69165fCc0552535907f11D6ed0a9';
  //academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  //Deploy AcademyClassList
  academyClassList = await deployer.deploy(AcademyClassList, {from: accounts[0]});
  //academyClassListAddress = '0xf10A7106f7b3Ef3a933a6E177f6871Bad86a9606';
  //academyClassList = await AcademyClassList.at(academyClassListAddress);
  console.log("academyClassList.address: ", academyClassList.address);

  //grantRole for AcademyClassList in academyStudents
  //"0x0000000000000000000000000000000000000000000000000000000000000000","0x0fC5025C764cE34df352757e82f7B5c4Df39A836"
  console.log("grantRole for AcademyClassList in academyStudents");
  await academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudents", result);

  //Deploy AcademyStudentQuiz
  academyStudentQuiz = await deployer.deploy(AcademyStudentQuiz, {from: accounts[0]});
  //academyStudentQuizAddress = '0x9792E3660B9CE434e4c777f2815968b9d9607168';
  //academyStudentQuiz = await AcademyStudentQuiz.at(academyStudentQuizAddress);  
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);

  //grantRole for AcademyClassList in AcademyStudentQuiz
  console.log("\ngrantRole for AcademyClassList in AcademyStudentQuiz");
  await academyStudentQuiz.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudentQuiz?
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudentQuiz", result);  



////////////////////////////// class "Devs 2021-01"
  //AcademyClassList.createAcademyClass
  className = "Devs 2021-01";
  console.log("\nAcademyClassList.createAcademyClass ", className);
  console.log("\n", academyStudents.address, academyStudentQuiz.address, className);
  class01 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: accounts[0]});
  class01Address = class01.logs[3].args[0];  
  console.log("OK\n", JSON.stringify(class01.logs));

  //class01Address = '0x2dD6Ce85e5d9A92CBCA9a5d2A306dEbe52496E76';
  class01 = await AcademyClass.at(class01Address);
  console.log("class01.Address: ", class01.address);

  //Is class01 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 admin in academyStudents", result);

  //Is class01 admin in AcademyStudentQuiz?
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 admin in academyStudentQuiz", result);  


////////////////////////////// class "Business 2021-02"
  //AcademyClassList.createAcademyClass
  className = "Business 2021-02";
  console.log("\nAcademyClassList.createAcademyClass ", className);
  
  class02 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: academyOwner});
  class02Address = await class02.logs[3].args[0];
  //console.log(JSON.stringify(class02));
  //class02Address = '0x2dD6Ce85e5d9A92CBCA9a5d2A306dEbe52496E76';
  class02 = await AcademyClass.at(class02Address);
  console.log("class02Address: ", class02Address);
  console.log("class02.Address: ", class02.address); 

  //Is class02 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class02.address);
  console.log("class02 admin in academyStudents", result);

  //Is class01 admin in AcademyStudentQuiz?
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, class02.address);
  console.log("class02 admin in academyStudentQuiz", result);    

/*  
*/

console.log("\n\n\n");

};
