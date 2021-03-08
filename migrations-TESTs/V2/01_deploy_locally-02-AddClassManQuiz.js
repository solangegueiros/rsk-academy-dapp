const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const StudentPortfolio = artifacts.require("StudentPortfolio");
const MasterName = artifacts.require("MasterName");
const NameSol = artifacts.require("NameSol");
const Name = artifacts.require("Name");
const MasterQuote = artifacts.require("MasterQuote");
const Quote = artifacts.require("Quote");

const AcademyStudentQuiz = artifacts.require("AcademyStudentQuiz");

/*
This migration file is to be used locally.

It create a class manually (not using AcademyClassList)

Add student and quiz
*/


module.exports = async (deployer, network, accounts) => {

  //accountStudent = accounts[1];
  const [academyOwner, accountStudent, accountStudent2] = accounts;
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //Deploy AcademyClassList
  await deployer.deploy(AcademyClassList, {from: accounts[0]});
  academyClassList = await AcademyClassList.deployed();
  academyClassListAddress = academyClassList.address;
  console.log("academyClassList.address: ", academyClassListAddress);

  //Deploy AcademyProjectList
  academyProjectList = await deployer.deploy(AcademyProjectList, {from: accounts[0]});
  console.log("academyProjectList.address: ", academyProjectList.address);

  //Deploy AcademyStudents, using addressProjectList
  academyStudents = await deployer.deploy(AcademyStudents, academyProjectList.address, {from: accounts[0]});
  console.log("academyStudents.address: ", academyStudents.address);

  //grantRole for AcademyClassList in academyStudents
  console.log("grantRole for AcademyClassList in academyStudents");
  //"0x0000000000000000000000000000000000000000000000000000000000000000","0x0fC5025C764cE34df352757e82f7B5c4Df39A836"
  await academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});

  //Deploy AcademyStudentQuiz
  academyStudentQuiz = await deployer.deploy(AcademyStudentQuiz, {from: accounts[0]});
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);

  //grantRole for AcademyClassList in AcademyStudentQuiz
  console.log("grantRole for AcademyClassList in AcademyStudentQuiz");
  //"0x0000000000000000000000000000000000000000000000000000000000000000","0x0fC5025C764cE34df352757e82f7B5c4Df39A836"
  await academyStudentQuiz.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});

  //Is AcademyClassList admin in academyStudentQuiz?
  console.log("Is AcademyClassList admin in academyStudentQuiz?");
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList role in academyStudentQuiz", result);

  //AcademyClassList.createAcademyClass manually
  console.log("\nAcademyClassList.createAcademyClass manually");
  className = "Devs 2021-03";
  class03 = await deployer.deploy(AcademyClass, academyStudents.address, academyStudentQuiz.address, className, {from: accounts[0]});
  console.log("class03.address: ", class03.address);

  await academyStudents.grantRole(DEFAULT_ADMIN_ROLE, class03.address, {from: accounts[0]});
  await academyStudentQuiz.grantRole(DEFAULT_ADMIN_ROLE, class03.address, {from: accounts[0]});

  //Student subscribe class03 => AcademyClass.subscribe class03
  console.log("\n\nAcademyClass.subscribe class03",  class03.address);
  await class03.subscribe({from: accountStudent});

  //Student did Quiz
  console.log("addStudentQuizAnswer");
  await class03.addStudentQuizAnswer(accountStudent, "Q1", "1 A 2 T 3 C 4 B 5 F", 5, 4, {from: accountStudent})
  
  quizInfo = await academyStudentQuiz.listQuizByStudent(accountStudent);
  console.log("\n quiz from ", accountStudent, quizInfo);

/*  
*/

  console.log("\n\n\n");
 
};
