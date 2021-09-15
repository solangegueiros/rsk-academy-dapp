import { ethers } from "hardhat";
import { expect } from "chai";
import {
  Certificate,
  Certificate__factory,
  Course,
  Course__factory,
  Courses,
  Courses__factory,
  Projects,
  Projects__factory,
  Quiz,
  Quiz__factory,
  Students,
  Students__factory,
  Wallet,
  Wallet__factory,
  MasterName,
  MasterName__factory,
  NameSol,
  NameSol__factory,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
const DEV_CLASS_NAME = "Devs 2021-01";

describe("All Contracts", async function () {
  let academyOwner: SignerWithAddress;
  let studentSol: SignerWithAddress;

  let _Wallet: Wallet__factory;
  let _Course: Course__factory;
  let _Projects: Projects__factory;
  let _Students: Students__factory;
  let _Courses: Courses__factory;
  let _Quiz: Quiz__factory;
  let _MasterName: MasterName__factory;
  let _NameSol: NameSol__factory;
  let _Certificate: Certificate__factory;

  let academyWallet: Wallet;
  let projects: Projects;
  let students: Students;
  let courses: Courses;
  let quiz: Quiz;
  let masterName: MasterName;
  let nameSol: NameSol;
  let certificate: Certificate;
  let developersClass: Course;

  beforeEach(async function () {
    [academyOwner, studentSol] = await ethers.getSigners();

    // Contract factories
    _Wallet = await ethers.getContractFactory("Wallet");
    _Course = await ethers.getContractFactory("Course");
    _Projects = await ethers.getContractFactory("Projects");
    _Students = await ethers.getContractFactory("Students");
    _Courses = await ethers.getContractFactory("Courses");
    _Quiz = await ethers.getContractFactory("Quiz");
    _MasterName = await ethers.getContractFactory("MasterName");
    _NameSol = await ethers.getContractFactory("NameSol", { signer: studentSol });
    _Certificate = await ethers.getContractFactory("Certificate");

    // Deployed contracts
    academyWallet = await _Wallet.deploy();
    projects = await _Projects.deploy();
    students = await _Students.deploy(projects.address);
    courses = await _Courses.deploy();
    quiz = await _Quiz.deploy();
    masterName = await _MasterName.deploy(students.address);
    nameSol = await _NameSol.deploy();
    certificate = await _Certificate.deploy(quiz.address, masterName.address);

    await (await students.grantRole(DEFAULT_ADMIN_ROLE, courses.address)).wait();
    await (await quiz.grantRole(DEFAULT_ADMIN_ROLE, courses.address)).wait();

    const developersClassTransaction = await (
      await courses.createCourse(students.address, quiz.address, DEV_CLASS_NAME)
    ).wait();
    developersClass = _Course.attach(developersClassTransaction.logs[3].address);
  });

  // Wallet
  describe("Wallet", async function () {
    const VALUE = 5000;
    it("Should transfer value to wallet", async function () {
      await (
        await studentSol.sendTransaction({
          to: academyWallet.address,
          value: VALUE,
        })
      ).wait();

      const sol = await studentSol.getBalance();
      const solBalance = await academyWallet.balanceOf(studentSol.address);
      expect(sol).not.equal(VALUE);
      expect(solBalance).to.equal(VALUE);
    });
  });

  // Quiz
  describe("Quiz", async function () {
    it("Should Courses admin be in Quiz", async function () {
      const hasRole = await quiz.hasRole(DEFAULT_ADMIN_ROLE, courses.address);
      expect(hasRole).to.equal(true);
    });
    it("Should DevelopersClass admin be in Quiz", async function () {
      const hasRole = await quiz.hasRole(DEFAULT_ADMIN_ROLE, developersClass.address);
      expect(hasRole).to.equal(true);
    });
  });

  // Quiz
  describe("Name", async function () {
    it("Should get correct name", async function () {
      const name = await nameSol.getName();
      expect(name).to.equal('Solange Gueiros');
    });
  });

  // Quiz
  describe("MasterName", async function () {
    it("Should check contract name", async function () {
      const isNameCorrect = await masterName.checkName(nameSol.address, 'Solange Gueiros');
      expect(isNameCorrect).to.equal(true);
    });
    it("Should count contracts", async function () {
      const countBeforeAdd = await masterName.countContracts();
      expect(countBeforeAdd).to.equal('0');
      await masterName.addContract(studentSol.address, nameSol.address, 'Solange Gueiros');
      const countAfterAdd = await masterName.countContracts();
      expect(countAfterAdd).to.equal('1');
    });
  });
});
