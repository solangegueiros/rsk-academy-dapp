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
    
interface iName {
    function owner() external view returns (address);
    function getName() external view returns (string memory);
}

interface iAcademyStudents {
    function isStudent(address account) external view returns (bool);
    function getStudentByAddress (address account) external view returns (StudentStruct memory);
}

interface iStudentPortfolio {
    function addProject (address projectAddress, string memory projectName) external returns (uint256);
    function deleteProjectByAddress (address projectAddress) external returns (bool);
}    


/*
    Precisa existir um Project para ter um Master que valide este project.
    
    Todo Master deve ter um PROJECT_NAME como o nome do project associado.
    O Master está associado a addressAcademy e addressStudentList
    Após criar um Master:
        seus address deve ser atualizado na ProjectList
        seu address deve ser autorizado em Academy
        
    O Master tem a lista dos estudantes que submeteram este projeto.
*/

// MasterName valida Name e acrescenta no Portfolio
// Lista do MasterName = Lista de Estudantes!

contract MasterName is AccessControl {

    string constant PROJECT_NAME = "Name";
    struct NameStruct {
        address owner;
        address scName;
        string name;
    }
    NameStruct[] private nameInfo;
    mapping(address => uint256) private ownerIndex;
    mapping(address => uint256) private scNameIndex;
    
    iAcademyStudents public studentList;

    constructor(address addressStudentList) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        studentList = iAcademyStudents(addressStudentList);
    }
    
    event NameAdded (address indexed owner, address indexed scName, string name);
    event NameDeleted (address indexed owner, address indexed scName, string name);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MasterName: only owner");
        _;
    }

    function addName (address scNameAddress, string memory name) public returns (bool) {
        _addName (msg.sender, scNameAddress, name);
        return true;
    }
    
    function addNameBySC (address scOwner, address scNameAddress, string memory name) public onlyOwner returns (bool) {
        _addName (scOwner, scNameAddress, name);
        return true;
    }
    
    function _addName (address scOwner, address scNameAddress,  string memory name) private returns (bool) {
        //Verificar se ja existe
        require (!existsSCName(scNameAddress), "scName exists");
        require (!existsOwner(scOwner), "owner exists");
        
        iName scName = iName(scNameAddress);
        //string memory name = scName.getName();
        require (compareStrings(scName.getName(), name), "different name");
        
        //Only owner's sc can add
        require (scName.owner() == scOwner, "only sc owner");
        
        NameStruct memory n;
        n.owner = scOwner;
        n.scName = scNameAddress;
        n.name = name;

        nameInfo.push(n);
        uint256 index = nameInfo.length;
        ownerIndex[scOwner] = index;
        scNameIndex[scNameAddress] = index;
        
        _addInPortfolio(scOwner, scNameAddress);

        emit NameAdded(scNameAddress, scOwner, name);
        return true;
    }    

    function _addInPortfolio(address scOwner, address scNameAddress) private returns (bool) {
        if (!studentList.isStudent(scOwner))
            return false;

        /* */
        StudentStruct memory s = studentList.getStudentByAddress(scOwner);        
        if (s.portfolioAddress != address(0x0)) {
            //Only AcademyStudents is allowed to adds projects

            iStudentPortfolio p = iStudentPortfolio(s.portfolioAddress);
            p.addProject(scNameAddress, PROJECT_NAME);
        }
        
        return true;
    }

    function deleteName () public returns (bool) {

        uint256 indexToDelete = ownerIndex[msg.sender];
        address scNameToDelete = nameInfo[indexToDelete].scName;

        emit NameDeleted (msg.sender, nameInfo[indexToDelete].scName, nameInfo[indexToDelete].name);

        //_deleteName (msg.sender);
        return true;        
    }

    function deleteNameBySC (address scOwner) public onlyOwner returns (bool) {
        _deleteName (scOwner);
        return true;        
    }

    function _deleteName (address scOwner) private returns (bool) {
        //require (existsOwner(scOwner), "owner not exists");

        uint256 indexToDelete = ownerIndex[scOwner];
        address scNameToDelete = nameInfo[indexToDelete].scName;

        emit NameDeleted (scOwner, nameInfo[indexToDelete].scName, nameInfo[indexToDelete].name);

        /*
        uint256 indexToMove = nameInfo.length-1;
        address ownerToMove = nameInfo[indexToMove].owner;
        address scNameToMove = nameInfo[indexToMove].scName;
        

        StudentStruct memory s = studentList.getStudentByAddress(scOwner); 
        if (s.portfolioAddress != address(0x0)) {
            //Only AcademyStudents is allowed to adds projects

            iStudentPortfolio p = iStudentPortfolio(s.portfolioAddress);
            p.deleteProjectByAddress(nameInfo[indexToDelete].scName);
        }
        */

        //emit NameDeleted (scOwner, scNameToDelete, nameInfo[indexToDelete].name);

        /*

        nameInfo[indexToDelete] = nameInfo[indexToMove];
        ownerIndex[ownerToMove] = indexToDelete;
        scNameIndex[scNameToMove] = indexToDelete;
    
        delete ownerIndex[scOwner];
        delete scNameIndex[scNameToDelete];
        nameInfo.pop();
        */

        return true;
    }
    
    function updateStudentList(address addressStudentList) public onlyOwner returns (bool) {
        studentList = iAcademyStudents(addressStudentList);
        return true;
    }
    
    //Owner pode ter mais de um SCName? NO
    function existsOwner(address account) public view returns (bool) {
        if (ownerIndex[account] == 0)
            return false;
        else
            return true;
    }
    
    function existsSCName(address scAddress) public view returns (bool) {
        if (scNameIndex[scAddress] == 0)
            return false;
        else
            return true;
    }
    
    function checkName (address scNameAddress, string memory name_) public view returns (bool) {
        //Name stored in scName equal name_
        iName scName = iName(scNameAddress);
        string memory name = scName.getName();
        if (compareStrings(name, name_)) {
            return true;
        }
        return false;
    }
    
    function listNameInfo () public view returns (NameStruct[] memory) {
        return nameInfo;
    }
    
    function countNames () public view returns (uint) {
        return (nameInfo.length);
    }

    function getOwnerSC (address scNameAddress) public view returns (address) {
        iName scName = iName(scNameAddress);
        return scName.owner();
    }
    
    function getName (address scNameAddress) public view returns (string memory) {
        iName scName = iName(scNameAddress);
        return scName.getName();
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }    
}
