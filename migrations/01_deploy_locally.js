const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const StudentPortfolio = artifacts.require("StudentPortfolio");
const MasterName = artifacts.require("MasterName");
const NameSol = artifacts.require("NameSol");
const Name = artifacts.require("Name");
const MasterQuote = artifacts.require("MasterQuote");


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
  academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});

  //AcademyClassList.createAcademyClass
  console.log("AcademyClassList.createAcademyClass (addressStudentList, className)");
  className = "Devs 2021-01";
  class01 = await academyClassList.createAcademyClass(academyStudents.address, className, {from: accounts[0]});
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
  class02 = await academyClassList.createAcademyClass(academyStudents.address, className, {from: accounts[0]});
  //console.log(JSON.stringify(class01));
  class02Address = await class02.logs[2].args[0];
  class02 = await AcademyClass.at(class02Address);
  console.log("class02Address: ", class02Address);
  console.log("class02.Address: ", class02.address);  

  //Student subscribe class01 => AcademyClass.subscribe class01
  console.log("\n\nAcademyClass.subscribe");
  await class01.subscribe({from: accountStudent});

  studentInClass = await class01.getStudentByAddress(accountStudent);
  console.log("\n studentInClass class01\n", studentInClass);
  student = await academyStudents.getStudentByAddress(accountStudent);
  console.log("\n student info\n", student);

  //Student subscribe class02 => AcademyClass.subscribe class02
  console.log("\n\nAcademyClass.subscribe");
  await class02.subscribe({from: accountStudent});

  studentInClass = await class02.getStudentByAddress(accountStudent);
  console.log("\n studentInClass class02\n", studentInClass); 
  student = await academyStudents.getStudentByAddress(accountStudent);
  console.log("\n student info\n", student);   

  //Student academyStudents.updateActiveClass class01
  result = await academyStudents.updateActiveClass(class01.address, {from: accountStudent});
  //console.log("\n Student academyStudents.updateActiveClass result\n", result);
  console.log("\n\n class01.Address: ", class01.address);

  student = await academyStudents.getStudentByAddress(accountStudent);
  console.log("\n student info\n", student);

  //academyStudents = await AcademyStudents.at("0x73f2aa5D251DbdEd6C950257124eA93bb00c0Ec0");
  //academyProjectList = await AcademyProjectList.at("0x24AfE1784672750155C2a504DB4b6f1eD76bBAEf");

  //In AcademyProjectList, addProject "Name"
  await academyProjectList.addProject("Name","Your name stored in a smart contract", {from: accounts[0]});
  await academyProjectList.addProject("Pig Bank","smart contract to save economies", {from: accounts[0]});
  await academyProjectList.addProject("Token","Mintable token ERC20", {from: accounts[0]});
  //await academyProjectList.addProject("CRUD","A basic database to Create Read Update Delete", {from: accounts[0]});
  //await academyProjectList.addProject("Photo Album","Photos stored in IPFS and hashes in a smart contract", {from: accounts[0]});

  //Deploy MasterName
  nameProject = "Name";
  masterName = await deployer.deploy(MasterName, academyStudents.address, {from: accounts[0]});
  console.log("masterName.Address: ", masterName.address);

  project = await academyProjectList.getProjectByName(nameProject);
  //console.log("\nproject\n", project);  
  //console.log("project.master", project.master);
  console.log("Update Master in Project Name");
  await academyProjectList.updateProjectByName(project.name, project.active, masterName.address, project.description, project.ABI);

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("\nproject AFTER\n", project);

  //Name
  yourName = await deployer.deploy(Name, {from: accountStudent});
  console.log("yourName.Address: ", yourName.address);

  console.log("\nValidate project Name in Mastername");
  await masterName.addName(yourName.address, "Your name", {from: accountStudent});

  console.log("\nacademyStudents.getStudentByAddress");
  student = await academyStudents.getStudentByAddress(accountStudent);
  //console.log("\n student\n", student);
  portfolio = await StudentPortfolio.at(student.portfolioAddress);
  console.log("portfolio.Address: ", portfolio.address);

  result = await portfolio.listPortfolio();
  console.log("\n portfolio\n", result);   

  result = await masterName.listNameInfo();
  console.log("\n MasterName list\n", result);
  
  //The student published a wrong name, then will delete the project and submit again
  console.log("\nstudent delete the wrong project");
  //result = await portfolio.deleteProjectByAddress(yourName.address, {from: accountStudent});
  result = await masterName.deleteName({from: accountStudent});
  console.log("\n Student masterName.deleteName result\n", JSON.stringify(result.logs));
  
  result = await portfolio.listPortfolio();
  console.log("\n portfolio AFTER deleteProjectByAddress \n", result);

  result = await masterName.listNameInfo();
  console.log("\n MasterName list AFTER deleteProjectByAddress\n", result);  

  //NameSol
  nameSol = await deployer.deploy(NameSol, {from: accountStudent});
  console.log("nameSol.Address: ", nameSol.address);

  console.log("\nValidate project NameSol in Mastername");
  await masterName.addName(nameSol.address, "Solange Gueiros", {from: accountStudent});

  console.log("\nacademyStudents.getStudentByAddress");
  student = await academyStudents.getStudentByAddress(accountStudent);
  console.log("\n student\n", student);  

  portfolio = await StudentPortfolio.at(student.portfolioAddress);
  console.log("portfolio.Address: ", portfolio.address);

  result = await portfolio.listPortfolio();
  console.log("\n portfolio\n", result); 

  //Second Project, Quote, only for tests

  //Deploy MasterQuote
  nameProject = "Quote";
  await academyProjectList.addProject("Quote","Write your phrases for eternity", {from: accounts[0]});
  masterQuote = await deployer.deploy(MasterQuote, academyStudents.address, {from: accounts[0]});
  console.log("masterQuote.Address: ", masterQuote.address);

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("Update Master in Project Quote");
  await academyProjectList.updateProjectByName(project.name, project.active, masterQuote.address, project.description, project.ABI);

  console.log("\nValidate project in Master");
  await masterQuote.validate(yourName.address, {from: accountStudent});

  //Student2 - Name
  //Student2 subscribe class01 => AcademyClass.subscribe class01
  console.log("\n\nStudent2 - AcademyClass.subscribe");
  await class01.subscribe({from: accountStudent2});

  yourName2 = await deployer.deploy(Name, {from: accountStudent2});
  console.log("yourName2.Address: ", yourName2.address);

  console.log("\nValidate project Name in Mastername");
  await masterName.addName(yourName2.address, "Your name", {from: accountStudent2});
  
/*  
*/

  console.log("\n\n\n");
 
};
