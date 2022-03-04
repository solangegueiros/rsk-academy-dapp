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

  let _Wallet: Wallet__factory
  let _Course: Course__factory
  let _Projects: Projects__factory
  let _Students: Students__factory
  let _Courses: Courses__factory
  let _Quiz: Quiz__factory
  let _MasterName: MasterName__factory
  let _NameSol: NameSol__factory
  let _Certificate: Certificate__factory

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
    _Wallet = await ethers.getContractFactory('Wallet')
    _Course = await ethers.getContractFactory('Course')
    _Projects = await ethers.getContractFactory('Projects')
    _Students = await ethers.getContractFactory('Students')
    _Courses = await ethers.getContractFactory('Courses')
    _Quiz = await ethers.getContractFactory('Quiz')
    _MasterName = await ethers.getContractFactory('MasterName')
    _NameSol = await ethers.getContractFactory('NameSol', { signer: studentSol })
    _Certificate = await ethers.getContractFactory('Certificate')

    // Deployed contracts
    academyWallet = await _Wallet.deploy()
    projects = await _Projects.deploy()
    students = await _Students.deploy(projects.address)
    courses = await _Courses.deploy()
    quiz = await _Quiz.deploy()
    masterName = await _MasterName.deploy(students.address)
    nameSol = await _NameSol.deploy()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    certificate = await _Certificate.deploy(quiz.address, masterName.address)

    await (await students.grantRole(DEFAULT_ADMIN_ROLE, courses.address)).wait()
    await (await quiz.grantRole(DEFAULT_ADMIN_ROLE, courses.address)).wait()

    const developersClassTransaction = await (
      await courses.createCourse(students.address, quiz.address, DEV_CLASS_NAME)
    ).wait()
    developersClass = _Course.attach(developersClassTransaction.logs[3].address)
  })

  // Wallet
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

  // Quiz
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

  // Quiz
  describe('NAME', async function () {
    it('Should get correct name', async function () {
      const name = await nameSol.getName()
      expect(name).to.equal('Solange Gueiros')
    })
  })

  // Quiz
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
