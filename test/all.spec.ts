import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import { expect } from 'chai'
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
} from '../types'

const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
const DEV_CLASS_NAME = 'Devs 2021-01'

describe('All Contracts', async function () {
  let academyOwner: SignerWithAddress
  let studentSol: SignerWithAddress

  let WalletFactory: Wallet__factory
  let CourseFactory: Course__factory
  let ProjectsFactory: Projects__factory
  let StudentsFactory: Students__factory
  let CoursesFactory: Courses__factory
  let QuizFactory: Quiz__factory
  let MasterNameFactory: MasterName__factory
  let NameSolFactory: NameSol__factory
  let CertificateFactory: Certificate__factory

  let academyWallet: Wallet
  let projects: Projects
  let students: Students
  let courses: Courses
  let quiz: Quiz
  let masterName: MasterName
  let nameSol: NameSol
  let certificate: Certificate
  let developersClass: Course

  before(async function () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;[academyOwner, studentSol] = await ethers.getSigners()

    // Contract factories
    WalletFactory = await ethers.getContractFactory('Wallet')
    CourseFactory = await ethers.getContractFactory('Course')
    ProjectsFactory = await ethers.getContractFactory('Projects')
    StudentsFactory = await ethers.getContractFactory('Students')
    CoursesFactory = await ethers.getContractFactory('Courses')
    QuizFactory = await ethers.getContractFactory('Quiz')
    MasterNameFactory = await ethers.getContractFactory('MasterName')
    NameSolFactory = await ethers.getContractFactory('NameSol', { signer: studentSol })
    CertificateFactory = await ethers.getContractFactory('Certificate')

    // Deployed contracts
    academyWallet = await WalletFactory.deploy()
    projects = await ProjectsFactory.deploy()
    students = await StudentsFactory.deploy(projects.address)
    courses = await CoursesFactory.deploy()
    quiz = await QuizFactory.deploy()
    masterName = await MasterNameFactory.deploy(students.address)
    nameSol = await NameSolFactory.deploy()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    certificate = await CertificateFactory.deploy(quiz.address, masterName.address)

    await (await students.grantRole(DEFAULT_ADMIN_ROLE, courses.address)).wait()
    await (await quiz.grantRole(DEFAULT_ADMIN_ROLE, courses.address)).wait()

    const developersClassTransaction = await (
      await courses.createCourse(students.address, quiz.address, DEV_CLASS_NAME)
    ).wait()
    developersClass = CourseFactory.attach(developersClassTransaction.logs[3].address)
  })

  // WALLET
  describe('WALLET', async function () {
    const VALUE = 5000
    it('Should transfer value to wallet', async function () {
      await (
        await studentSol.sendTransaction({
          to: academyWallet.address,
          value: VALUE,
        })
      ).wait()

      const sol = await studentSol.getBalance()
      const solBalance = await academyWallet.balanceOf(studentSol.address)
      expect(sol).not.equal(VALUE)
      expect(solBalance).to.equal(VALUE)
    })
  })

  // QUIZ
  describe('QUIZ', function () {
    describe('ROLE', function () {
      it('Should Courses admin be in Quiz', async function () {
        const hasRole = await quiz.hasRole(DEFAULT_ADMIN_ROLE, courses.address)
        expect(hasRole).to.equal(true)
      })
      it('Should DevelopersClass admin be in Quiz', async function () {
        const hasRole = await quiz.hasRole(DEFAULT_ADMIN_ROLE, developersClass.address)
        expect(hasRole).to.equal(true)
      })
    })

    describe('SUBMIT', function () {
      before(async function () {
        const submitQuizTx = await quiz.submitQuiz(studentSol.address, 'dev-01', 'x 1', 10, 6)
        await submitQuizTx.wait()
      })

      it('Should get the quiz names of the student', async function () {
        const studentQuizNames = await quiz.getStudentQuizzes(studentSol.address)
        expect(studentQuizNames[0]).to.equal('dev-01')
      })

      it('Should get the quiz info of the student', async function () {
        const studentQuiz = await quiz.getQuiz(studentSol.address, 'dev-01')
        expect(studentQuiz.answer).to.equal('x 1')
      })

      it('Should revert submitting for invalid quiz name', async function () {
        try {
          await quiz.submitQuiz(studentSol.address, '', 'x 1', 10, 6)
        } catch (error) {
          expect((error as Error).message).to.contains('quiz: invalid quiz')
        }
      })
    })
  })

  // NAME
  describe('NAME', async function () {
    it('Should get correct name', async function () {
      const name = await nameSol.getName()
      expect(name).to.equal('Solange Gueiros')
    })
  })

  // MASTER NAME
  describe('MASTER NAME', async function () {
    it('Should check contract name', async function () {
      const isNameCorrect = await masterName.checkName(nameSol.address, 'Solange Gueiros')
      expect(isNameCorrect).to.equal(true)
    })
    it('Should count contracts', async function () {
      const countBeforeAdd = await masterName.countContracts()
      expect(countBeforeAdd).to.equal('0')
      await masterName.addContract(studentSol.address, nameSol.address, 'Solange Gueiros')
      const countAfterAdd = await masterName.countContracts()
      expect(countAfterAdd).to.equal('1')
    })
  })
})
