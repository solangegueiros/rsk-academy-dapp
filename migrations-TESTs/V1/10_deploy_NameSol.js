const NameSol = artifacts.require("NameSol");

/*
This migration on Testnet for tests

   Deploying 'AcademyClassList'
   ----------------------------

Error:  *** Deployment Failed ***

"AcademyClassList" -- Unknown Error: {"jsonrpc":"2.0","id":5121065185459693,"error":{"code":-32010,"message":"the sender account doesn't exist"}}

{
  "originalError": {}
}.
*/


module.exports = async (deployer, network, accounts) => {

  if (network != "testnet") {
    console.log ("\n WRONG NETWORK! \n not deployed on: ", network, "\n\n\n");
    //return;
  }
  
  console.log ("\n network: ", network, "\n\n");

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  console.log ("\n accounts: \n", accounts);
  console.log ("academyOwner: ", academyOwner);
  console.log ("StudentSol: ", StudentSol);
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";


  //StudentSol submit NameSol.sol
  nameSol = await deployer.deploy(NameSol, {from: accounts[1]});
  console.log("nameSol.Address: ", nameSol.address);
  console.log("nameSol.Address: ", await nameSol.getName());

/*  
*/

  console.log("\n\n\n");
 
};
