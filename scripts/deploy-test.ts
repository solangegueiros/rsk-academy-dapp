import { ethers } from 'hardhat'
import fsExtra from 'fs-extra'

import {
  Certificate__factory,
  Courses__factory,
  Course__factory,
  MasterName__factory,
  NameSol__factory,
  Projects__factory,
  Quiz__factory,
  Students__factory,
  Wallet__factory,
} from '../typechain'

const consoleBreak = () => console.log(`\n${'/'.repeat(50)}\n`)

async function main() {
  const [academyOwner, studentSol] = await ethers.getSigners()
  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const ENV_PATH = '.env'
  const DEV_CLASS_NAME = 'Devs 2021-01'

  console.log('Deploying contracts with the account:', academyOwner.address)
  console.log('Account balance:', (await academyOwner.getBalance()).toString())
  console.log(`academyOwner`, academyOwner.address)
  console.log(`studentSol`, studentSol.address)

  consoleBreak()

  // Contract factories
  const _Wallet = <Wallet__factory>await ethers.getContractFactory('Wallet')
  const _Projects = <Projects__factory>await ethers.getContractFactory('Projects')
  const _Courses = <Courses__factory>await ethers.getContractFactory('Courses')
  const _Students = <Students__factory>await ethers.getContractFactory('Students')
  const _Quiz = <Quiz__factory>await ethers.getContractFactory('Quiz')
  const _MasterName = (await ethers.getContractFactory('MasterName')) as MasterName__factory
  const _NameSol = (await ethers.getContractFactory('NameSol', { signer: studentSol })) as NameSol__factory
  const _Certificate = (await ethers.getContractFactory('Certificate')) as Certificate__factory
  const _Course = (await ethers.getContractFactory('Course')) as Course__factory

  // Deploy contracts
  const wallet = await _Wallet.deploy()
  const projects = await _Projects.deploy()
  const courses = await _Courses.deploy()
  const students = await _Students.deploy(projects.address)
  const quiz = await _Quiz.deploy()
  const masterName = await _MasterName.deploy(students.address)
  const nameSol = await _NameSol.deploy()
  const certificate = await _Certificate.deploy(quiz.address, masterName.address)

  await students.grantRole(DEFAULT_ADMIN_ROLE, courses.address)
  await quiz.grantRole(DEFAULT_ADMIN_ROLE, courses.address)

  const developersCourseTransaction = await courses.createCourse(students.address, quiz.address, DEV_CLASS_NAME)
  const developersCourseTransactionReceipt = await developersCourseTransaction.wait()
  const developersCourse = _Course.attach(developersCourseTransactionReceipt.logs[3].address)

  // Log and save addresses
  const ADDRESSES = {
    WALLET: wallet.address,
    PROJECTS: projects.address,
    STUDENTS: students.address,
    COURSES: courses.address,
    QUIZ: quiz.address,
    MASTER_NAME: masterName.address,
    NAME_SOL: nameSol.address,
    CERTIFICATE: certificate.address,
    DEVELOPER_COURSE: developersCourse.address,
  }

  if (fsExtra.existsSync(ENV_PATH)) fsExtra.removeSync(ENV_PATH)

  Object.entries(ADDRESSES).forEach(([key, address]) => {
    console.log(key, address)
    fsExtra.appendFileSync(ENV_PATH, `${key}=${address}\n`)
  })

  consoleBreak()

  const hasQuizRoleInCourses = await quiz.hasRole(DEFAULT_ADMIN_ROLE, courses.address)
  console.log(`has_quiz_role_in_courses`, hasQuizRoleInCourses)
  const hasStudentsRoleInCourses = await students.hasRole(DEFAULT_ADMIN_ROLE, courses.address)
  console.log(`has_students_role_in_courses`, hasStudentsRoleInCourses)
  const hasStudentsRoleInDevelopers = await students.hasRole(DEFAULT_ADMIN_ROLE, developersCourse.address)
  console.log(`has_students_role_in_developers`, hasStudentsRoleInDevelopers)
  const hasQuizRoleInDevelopers = await students.hasRole(DEFAULT_ADMIN_ROLE, developersCourse.address)
  console.log(`has_quiz_role_in_developers`, hasQuizRoleInDevelopers)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
