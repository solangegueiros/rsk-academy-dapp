import { ethers } from 'hardhat'
import fsExtra from 'fs-extra'

const consoleBreak = () => console.log(`\n${'/'.repeat(50)}\n`)

async function main() {
  consoleBreak()

  const [academyOwner, studentA, studentB] = await ethers.getSigners()
  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const LOG_PATH = 'deploy.log'
  const DEV_CLASS_NAME = 'Devs 2021-01'
  const BUSINESS_CLASS_NAME = 'Business 2021-02'

  console.log('Deploying contracts with the account:', academyOwner.address)
  console.log('Account balance:', (await academyOwner.getBalance()).toString())
  console.log(`Academy Owner`, academyOwner.address)
  console.log(`Student A`, studentA.address)
  console.log(`Student B`, studentB.address)

  consoleBreak()

  // Contract factories
  const WalletFactory = await ethers.getContractFactory('Wallet')
  const ProjectsFactory = await ethers.getContractFactory('Projects')
  const CoursesFactory = await ethers.getContractFactory('Courses')
  const StudentsFactory = await ethers.getContractFactory('Students')
  const QuizFactory = await ethers.getContractFactory('Quiz')
  const MasterNameFactory = await ethers.getContractFactory('MasterName')
  const NameSolFactory = await ethers.getContractFactory('NameSol', { signer: studentA })
  const CertificateFactory = await ethers.getContractFactory('Certificate')
  const CourseFactory = await ethers.getContractFactory('Course')

  // Deploy contracts
  const wallet = await WalletFactory.deploy()
  const projects = await ProjectsFactory.deploy()
  const courses = await CoursesFactory.deploy()
  const students = await StudentsFactory.deploy(projects.address)
  const quiz = await QuizFactory.deploy()
  const masterName = await MasterNameFactory.deploy(students.address)
  const nameSol = await NameSolFactory.deploy()
  const certificate = await CertificateFactory.deploy(quiz.address, masterName.address)

  await students.grantRole(DEFAULT_ADMIN_ROLE, courses.address)
  await quiz.grantRole(DEFAULT_ADMIN_ROLE, courses.address)

  const developersCourseTransaction = await courses.createCourse(students.address, quiz.address, DEV_CLASS_NAME)
  const developersCourseTransactionReceipt = await developersCourseTransaction.wait()
  const developersCourse = CourseFactory.attach(developersCourseTransactionReceipt.logs[0].address)

  const businessCourseTransaction = await courses.createCourse(students.address, quiz.address, BUSINESS_CLASS_NAME)
  const businessCourseTransactionReceipt = await businessCourseTransaction.wait()
  const businessCourse = CourseFactory.attach(businessCourseTransactionReceipt.logs[0].address)

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
    BUSINESS_COURSE: businessCourse.address,
  }

  if (fsExtra.existsSync(LOG_PATH)) fsExtra.removeSync(LOG_PATH)

  Object.entries(ADDRESSES).forEach(([key, address]) => {
    console.log(key, address)
    fsExtra.appendFileSync(LOG_PATH, `${key}=${address}\n`)
  })

  consoleBreak()

  const hasQuizRoleInCourses = await quiz.hasRole(DEFAULT_ADMIN_ROLE, courses.address)
  console.log(`"Quiz" contract has role in "Courses" contract`, hasQuizRoleInCourses)

  const hasQuizRoleInDevelopers = await students.hasRole(DEFAULT_ADMIN_ROLE, developersCourse.address)
  console.log(`"Quiz" contract has role in "Developers" contract`, hasQuizRoleInDevelopers)

  const hasQuizRoleInBusiness = await students.hasRole(DEFAULT_ADMIN_ROLE, businessCourse.address)
  console.log(`"Quiz contract has role in "Business" contract`, hasQuizRoleInBusiness)

  const hasStudentsRoleInCourses = await students.hasRole(DEFAULT_ADMIN_ROLE, courses.address)
  console.log(`"Students" contract has role in "Courses" contract`, hasStudentsRoleInCourses)

  const hasStudentsRoleInDevelopers = await students.hasRole(DEFAULT_ADMIN_ROLE, developersCourse.address)
  console.log(`"Students" contract has role in "Developers" contract`, hasStudentsRoleInDevelopers)

  const hasStudentsRoleInBusiness = await students.hasRole(DEFAULT_ADMIN_ROLE, businessCourse.address)
  console.log(`"Students contract has role in "Business" contract`, hasStudentsRoleInBusiness)

  consoleBreak()
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
