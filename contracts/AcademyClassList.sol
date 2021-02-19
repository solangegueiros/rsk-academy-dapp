// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
import '@openzeppelin/contracts/access/AccessControl.sol';


struct ClassStruct {
    uint index;
    address classAddress;
    bool active;
    string name;
}

//enum studentStatus {Canceled = 0, InProgress = 1, Completed = 2}
enum StudentStatus {Canceled, InProgress, Completed}

struct StudentInClass {
    StudentStatus status;
    uint start;         // UNIX timestamp when the student enrolled
    uint end;           // UNIX timestamp when the student ended
}

interface iAcademyStudents {
    function isStudent(address account) external view returns (bool);
    function addStudent (address account) external returns (uint256);
    function addClass (address account, address classAddress) external returns (bool);
    function updateStudentActiveClass (address account, address classAddress) external returns (bool);
    function grantRole (bytes32 role, address account) external;
    
    //function delStudent (address account) external returns (bool);
    //function updateName (address account, address scAddress, string memory name_) external returns (bool);
    //function updatePortfolio (address account, address portfolioAddress) external returns (bool);
}


contract AcademyClassList is AccessControl {
    //Factory de AcademyClass
    
    mapping(address => ClassStruct) private classInfo;
    address[] private classAddressIndex;

    bool public active;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
    }

    event AcademyClassCreated(address indexed classAddress, string className);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyClassList: only owner");
        _;
    }
    
    modifier onlyActive() {
        require(active, "AcademyClassList: not active");
        _;
    } 

    function createAcademyClass(address addressStudentList, string memory className) public onlyOwner onlyActive returns (address) {
        //className = "Devs 2021-01";
        //Pode ter className repetido? SIM
        
        AcademyClass ac = new AcademyClass(addressStudentList, className);
        address classAddress = address(ac);
        
        classInfo[classAddress].classAddress = classAddress;
        classInfo[classAddress].active = true;
        classInfo[classAddress].name = className;
        classAddressIndex.push(classAddress);
        uint256 index = classAddressIndex.length - 1;
        classInfo[classAddress].index = index;
        
        iAcademyStudents studentList = iAcademyStudents(addressStudentList);
        studentList.grantRole(DEFAULT_ADMIN_ROLE, classAddress);

        emit AcademyClassCreated (classAddress, className);
        return classAddress;
    }
    
    function changeActiveClass(address classAddress) public onlyOwner onlyActive returns (bool) {
        require (!isAcademyClass(classAddress), "class not exists");
        classInfo[classAddress].active = !classInfo[classAddress].active;
        AcademyClass c = AcademyClass(classAddress);
        c.changeClassStatus();
        return true;
    }

    function addClassOwner(address account, address classAddress) public onlyOwner onlyActive {
        AcademyClass c = AcademyClass(classAddress);
        c.grantRole(DEFAULT_ADMIN_ROLE, account);
    }
    
    function delClassOwner(address account, address classAddress) public onlyOwner onlyActive {
        AcademyClass c = AcademyClass(classAddress);
        c.revokeRole(DEFAULT_ADMIN_ROLE, account);
    }    
    
    function changeActive () public onlyOwner returns (bool) {
        active = !active;
        return active;
    }
    
    function isAcademyClass(address classAddress) public view returns (bool) {
        if(classAddressIndex.length == 0) return false;
        return (classAddressIndex[classInfo[classAddress].index] == classAddress);
    }

    function getAcademyClass (address classAddress) public view returns (ClassStruct memory) {
        return classInfo[classAddress];
    }    
    
    function countAcademyClasses () public view returns (uint) {
        return (classAddressIndex.length);
    }
    
    function listAcademyClasses () public view returns (address[] memory) {
        return classAddressIndex;
    } 

}


contract AcademyClass is AccessControl {
    
    string public className;
    bool public active;    // If NOT active, can't add students
    iAcademyStudents public studentList;

    mapping(address => StudentInClass) private studentInClassInfo;
    address[] private studentAddressList;

    constructor(address addressStudentList, string memory className_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        className = className_;
        active = true;
        studentList = iAcademyStudents(addressStudentList);
    }

    event StudentAddedInClass(address indexed _studentAddress);
    event StudentStatusChanged(address indexed _studentAddress, StudentStatus _status);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyClass: only owner");
        _;
    }
    
    modifier onlyActive() {
        require(active, "AcademyClass: not active");
        _;
    }

    function subscribe () public returns (bool) {
        _addStudent(msg.sender);
        return true;
    }
    
    function addStudent (address account) public onlyOwner returns (bool) {
        _addStudent(account);
        return true;
    }    
    
    function _addStudent (address account) private onlyActive returns (uint256) {
        require (!isStudent(account), "student already exists");
        uint256 indexStudent = 0;

        studentInClassInfo[account].status = StudentStatus.InProgress;
        studentInClassInfo[account].start = block.timestamp;
        studentAddressList.push(account);
        
        //In AcademyStudents?
        if (!studentList.isStudent(account)) {
            indexStudent = studentList.addStudent(account);
        }
        else {
            //getStudent
        }
        
        address classAddress = address(this);
        require (studentList.updateStudentActiveClass(account, classAddress), "Error in studentList.updateStudentActiveClass");

        require (studentList.addClass(account, classAddress), "Error in studentList.addClass");
        require (studentList.addClass(account, classAddress), "Error in studentList.addClass");
        /*
        address classAddress = 0x427dfB843b6164AF4bc2D121F778aEA3bB4e0A20;        
        require (studentList.addClass(account, classAddress), "Error in studentList.addClass");        
        studentList.updateStudentActiveClass(account, classAddress);
        */
        

        emit StudentAddedInClass(account);
        return indexStudent;
    }

    function courseComplete (address account) onlyOwner onlyActive public returns (bool) {
        require (isStudent(account), "student not exists");
        studentInClassInfo[account].status = StudentStatus.Completed;
        studentInClassInfo[account].end = block.timestamp;
        emit StudentStatusChanged (account, StudentStatus.Completed);
        return true;
    }
    
    function unsubscribe () public returns (bool) {
        //require (account == msg.sender, "only himself");
        _cancelStudent(msg.sender);
        return true;
    }    
    
    function cancelStudent (address account) onlyOwner public returns (bool) {
        _cancelStudent(account);
        return true;
    }    

    function _cancelStudent (address account) private onlyActive {
        require (isStudent(account), "student not exists");
        studentInClassInfo[account].status = StudentStatus.Canceled;
        studentInClassInfo[account].end = block.timestamp;
        emit StudentStatusChanged (account, StudentStatus.Canceled);
    }
    
    function changeClassStatus () public onlyOwner returns (bool) {
        active = !active;
        return active;
    }
    
    function isStudent (address account) public view returns (bool) {
        //if (!compareStrings(studentInfo[account].name, ""))
        if (studentInClassInfo[account].start > 0)
            return true;
        else
            return false;
    }

    function getStudentByAddress (address account) public view returns (StudentInClass memory) {
        require(isStudent(account), "not student");
        return studentInClassInfo[account];
    }

    function listStudentsByAddress () public view returns (address[] memory) {
        return studentAddressList;
    }

    function countStudents () public view returns (uint) {
        return (studentAddressList.length);
    }
    
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}

