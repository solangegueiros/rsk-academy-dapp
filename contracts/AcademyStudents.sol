// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
import '@openzeppelin/contracts/access/AccessControl.sol';

struct StudentStruct {
    uint index;
    address ownerAddress;
    address portfolioAddress;
    address activeClass;
    address[] studentClasses;
}

struct ProjectStruct {
    bool active;
    address master;
    string name;
    string description;
    string ABI;
    string sourceCode;
}

interface iName {
    //function owner() external returns (address);
    //function getName() external view returns (string memory);
}

interface iAcademyClass {
    function addStudent (address account) external returns (bool);
    function isStudent (address account) external view returns (bool);
}

interface iAcademyProjectList {
   function exists(string memory name) external view returns (bool);
    function isActive(string memory name) external view returns (bool);
    function getProjectByName (string memory name_) external view returns (ProjectStruct memory);
    function getMasterAddressByName (string memory name_) external view returns (address);
}


contract AcademyStudents is AccessControl {

    address public projectListAddress;
    bool active;

    mapping(address => StudentStruct) private studentInfo;
    address[] private studentIndex;
    mapping(address => mapping (address=>bool) ) private studentClassSubscribed;
    
    constructor(address addressProjectList) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
        projectListAddress = addressProjectList;
    }

    event StudentCreated(address indexed studentAddress);
    event StudentRemoved(address indexed studentAddress);
    event StudentSubscribed(address indexed classAddress, address indexed studentAddress);
    event StudentClassSelected(address indexed classAddress, address indexed studentAddress);
    
    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyStudents: only owner");
        _;
    }
    
    modifier onlyActive() {
        require(active, "AcademyStudents: not active");
        _;
    } 

    function addStudent (address account) public onlyOwner onlyActive returns (uint256) {
        uint256 indexStudent;
        if (!isStudent(account)) {
            indexStudent = _addStudent(account);
        }
        
        //Portfolio created for each student
        StudentPortfolio p = new StudentPortfolio (account, projectListAddress);
        studentInfo[account].portfolioAddress = address(p);
        
        return indexStudent;
    }
    
    function _addStudent (address account) private returns (uint256) {
        if (isStudent(account))
            return 0;
        //require (!isStudent(account), "student already exists");
        
        studentInfo[account].ownerAddress = account;
        studentIndex.push(account);
        uint256 index = studentIndex.length - 1;
        studentInfo[account].index = index;
        
        emit StudentCreated(account);
        return index;
    }
    
    function delStudent (address account) public onlyOwner onlyActive returns (bool) {
        _delStudent(account);
        return true;
    }
    
    function _delStudent (address account) private returns (bool) {
        if (!isStudent(account))
            return false;
        //require (isStudent(account), "student not exists");
        
        uint indexToDelete = studentInfo[account].index;
        address keyToMove = studentIndex[studentIndex.length-1];
        studentIndex[indexToDelete] = keyToMove;
        studentInfo[keyToMove].index = indexToDelete;
        
        delete studentInfo[account];
        studentIndex.pop();
        
        //Mantém o Portfolio do estudante?

        emit StudentRemoved(account);
        return true;
    }

    function addClass (address account, address classAddress) public onlyOwner onlyActive returns (bool) {
        if (!isStudent(account)) 
            return false;

        //Verificar se ele já está inscrito nesta classe
        if (!studentClassSubscribed[account][classAddress]) {
            studentInfo[account].studentClasses.push(classAddress);
            studentClassSubscribed[account][classAddress] = true;
        }
        
        emit StudentSubscribed(classAddress, account);
        return true;
    }

    function updateActiveClass (address classAddress) public returns (bool) {
        return _updateActiveClass(msg.sender, classAddress);
    }
    
    function updateStudentActiveClass (address account, address classAddress) public onlyOwner returns (bool) {
        return _updateActiveClass(account, classAddress);
    }

    function _updateActiveClass (address account, address classAddress) public onlyActive returns (bool) {
        if (!isStudent(account))
            return false;
        studentInfo[account].activeClass = classAddress;
        emit StudentClassSelected(classAddress, account);
        return true;
    }

    function changeActive () public onlyOwner returns (bool) {
        active = !active;
        return active;
    }

    function updateProjectListAddress (address addressProjectList) public onlyOwner returns (bool) {
        projectListAddress = addressProjectList;
        return true;
    }
    
    function isStudent(address account) public view returns (bool) {
        if(studentIndex.length == 0) return false;
        return (studentIndex[studentInfo[account].index] == account);
    }
    
    function getStudentByAddress (address account) public view returns (StudentStruct memory) {
        if (!isStudent(account)) {
            StudentStruct memory s;
            return s;
        }
        else 
            return studentInfo[account];
    }

    function countStudents () public view returns (uint256) {
        return studentIndex.length;
    }
    
    function listStudents () public view returns (address[] memory) {
        return studentIndex;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}


contract StudentPortfolio is AccessControl {
    //One StudentPortfolio per Student
    
    struct PortfolioStruct {
        address projectAddress; // Key
        //iAcademyProjects.ProjectStruct name;
        string name;    // Key for iAcademyProjects.ProjectStruct
    }
    PortfolioStruct[] private portfolioProjects;
    
    mapping(address => uint256) private addressIndex;
    mapping(string => uint256) private nameIndex;

    address public student;
    //address public projectList;
    iAcademyProjectList public projectList;
    
    constructor(address account, address addressProjectList) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        student = account;
        //projectList = addressProjectList;
        projectList = iAcademyProjectList(addressProjectList);
        
        //addProject(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,"P1");
    }

    event PortfolioProjectAdded(address indexed projectAddress, string projectName);
    event PortfolioProjectDeleted(address indexed projectAddress, string projectName);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "StudentPortfolio: only owner");
        _;
    }
    
    modifier onlyOwnerOrStudent() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || (msg.sender == student), "StudentPortfolio: only student or owner");
        _;
    }

    function addProject (address projectAddress, string memory projectName) public returns(uint256) {
        //Owners serão os Masters ou Academy. Somente eles podem adicionar projetos, porque validam cada projeto antes de adicionar.
        //melhor somente Academy pode adicionar, Masters chamam Academy
        require (!compareStrings(projectName, ""), "invalid name");
        require (!(projectAddress == address(0x0)), "invalid address");
        require (projectList.exists(projectName), "project not exists");
        require (projectList.isActive(projectName), "project not active");
        require(msg.sender == projectList.getMasterAddressByName(projectName), "Only Master can add project in portfolio");
        
        // O estudante pode ter mais de um address por projeto? NÃO
        require (!addressInPortfolio(projectAddress), "address exists");
        require (!nameInPortfolio(projectName), "project exists");

        PortfolioStruct memory p;
        p.projectAddress = projectAddress;
        p.name = projectName;

        portfolioProjects.push(p);
        uint256 index = portfolioProjects.length; 
        addressIndex[projectAddress] = index;
        nameIndex[projectName] = index;

        emit PortfolioProjectAdded(projectAddress, projectName);
        return index;
    }
    
    function deleteProjectByAddress (address projectAddress) public returns (bool) {
        //Se o estudante não gostar do seu projeto, pode apagá-lo para submete-lo novamente.
        //onlyOwnerOrStudent
        require (!(projectAddress == address(0x0)), "invalid address");
        require (addressInPortfolio(projectAddress), "address not exists");

        //Porém, dependendo do projeto, ele terá que apagar no MasterProject.
        //Definir que um projeto só pode ser apagado em seu MasterProject? SIM!        
        require(msg.sender == projectList.getMasterAddressByName(portfolioProjects[addressIndex[projectAddress]].name), 
            "Only Master can add project in portfolio");

        
        uint256 indexToDelete = addressIndex[projectAddress]-1;
        string memory nameToDelete =  portfolioProjects[indexToDelete].name;
        delete addressIndex[projectAddress];
        delete nameIndex[nameToDelete];
        
        uint256 indexToMove = portfolioProjects.length-1;
        address keyToMove = portfolioProjects[indexToMove].projectAddress;
        portfolioProjects[indexToDelete] = portfolioProjects[indexToMove];
        addressIndex[keyToMove] = indexToDelete+1;
        nameIndex[portfolioProjects[indexToMove].name] = indexToDelete+1;
        portfolioProjects.pop();

        emit PortfolioProjectDeleted(projectAddress, nameToDelete);
        return true;
    }
 
    function updateProjectList (address addressProjectList) public onlyOwner returns (bool) {
        projectList = iAcademyProjectList(addressProjectList);
        return true;
    }

    function addressInPortfolio (address projectAddress) public view returns (bool) {
        //if(portfolioProjects.length == 0) return false;
        
        if (addressIndex[projectAddress] == 0)
            return false;
        else
            return true;
    }

    function nameInPortfolio (string memory projectName) public view returns (bool) {
        if (nameIndex[projectName] == 0)
            return false;
        else
            return true;
    }
    
    function listPortfolio () public view returns (PortfolioStruct[] memory) {
        return (portfolioProjects);
    }
    
    function countPortfolio () public view returns (uint) {
        return (portfolioProjects.length);
    }

    function projectByName (string memory projectName) public view returns (PortfolioStruct memory) {
        return portfolioProjects[nameIndex[projectName]-1];
    }
    
    function projectByAddress (address projectAddress) public view returns (PortfolioStruct memory) {
        return portfolioProjects[addressIndex[projectAddress]-1];
    }
    
    function projectByIndex (uint256 index) public view returns (PortfolioStruct memory) {
        return portfolioProjects[index-1];
    }    

    function indexOfProject (address projectAddress) public view returns (uint) {
        return addressIndex[projectAddress];
    }
    
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    
}

