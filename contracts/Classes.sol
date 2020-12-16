pragma solidity 0.5.4;
pragma experimental ABIEncoderV2;

contract Classes {
    address public owner;
    address[] public studentAddresses;
    
    string[] public classDates;                     //Format: year-month-day
    mapping(string => address[]) classAttendance;
    mapping(address => string[]) studentAttendance;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }    

    function addClass(string memory _date) public onlyOwner returns (bool) {
        classDates.push(_date);
        return true;
    }

    function addAttendance(string memory _date) public returns (bool) {
        classAttendance[_date].push(msg.sender);
        studentAttendance[msg.sender].push(_date);
        return true;
    }

    function getAttendanceByDate(string memory _date) public view returns (address[] memory) {
        return classAttendance[_date];
    }
    
    function getAttendanceByStudent(address _student) public view returns (string[] memory) {
        return studentAttendance[_student];
    }
    
    function listClassDates () public view returns (string[] memory) {
        return classDates;
    }
    
    function listStudentAddresses () public view returns (address[] memory) {
        return studentAddresses;
    }
    
}
