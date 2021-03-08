/*
This migration file is to be used in a network.
It creates all structure, including:
- 1 project in AcademyProjectList: "Name"
- 1 class: 
    class01 = "Devs 2021-01"
*/

const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const StudentPortfolio = artifacts.require("StudentPortfolio");
const MasterName = artifacts.require("MasterName");

module.exports = async (deployer, network, accounts) => {

  //accountStudent = accounts[1];
  const [academyOwner, accountStudent] = accounts;
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

  //In AcademyProjectList, addProject "Name" => DONE
  await academyProjectList.addProject("Name","Your name stored in a smart contract", {from: accounts[0]});

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


/*  
*/

  console.log("\n\n\n");

};
