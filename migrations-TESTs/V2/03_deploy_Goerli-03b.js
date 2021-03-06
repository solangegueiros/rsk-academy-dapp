/*
This migration file is to be used in a network.
It creates
class1
class2

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
  academyProjectListAddress = '0xECf3BB2f2c7571d67bbcb4738B16ACfE9F3E21D0';
  academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //Deploy AcademyStudents, using addressProjectList
  academyStudentsAddress = '0x681c4987655f1d2e4335B70bc79C4FE8213d5E81';
  academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  //Deploy AcademyClassList
  academyClassListAddress = '0x4502Ce0c6cf7c3e5f5992e9b7F79E0c5C151d63e';
  academyClassList = await AcademyClassList.at(academyClassListAddress);
  console.log("academyClassList.address: ", academyClassList.address);

  //Deploy AcademyStudentQuiz
  academyStudentQuizAddress = '0x996BECf5278d512554fD3cd4d127C8D3085Db88E';
  academyStudentQuiz = await AcademyStudentQuiz.at(academyStudentQuizAddress);  
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);


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
