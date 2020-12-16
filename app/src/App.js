import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import './App.css';
import MasterName from "./contracts/MasterName.json";

function App() {
  const [account, setAccount] = useState('');
  const [masterName, setMasterName] = useState(null);

  const [test, setTest] = useState();
  const [listAddressOwners, setListAddressOwners] = useState();
  const [listAddressSCNames, setListAddressSCNames] = useState();
  const [listNames, setListNames] = useState();

 

  useEffect(() => {
    async function loadWeb3() {      
      //window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          'Non-Ethereum browser detected. You should consider trying MetaMask!',
        );
      }
      console.log (window.web3.currentProvider);
    }
    
    async function loadBlockchainData() {
      try {
        const web3 = window.web3;
       
        // Load first account
        const [account] = await web3.eth.getAccounts();
        console.log ('account: ', account);
        setAccount(account);

        // Check which network is active on web3
        const networkId = await web3.eth.net.getId();
        console.log ('networkId: ', networkId);

        // Check if contract has been published on that network
        var networkData = MasterName.networks[networkId];        
        if (networkData) {
          console.log ('MasterName address: ', networkData.address);
          var contract = new web3.eth.Contract(
            MasterName.abi,
            networkData.address,
          );
          setMasterName(contract);
          console.log ('MasterName: ', contract);
        }

        /*
        var networkData = MasterName.networks[networkId];        
        if (networkData) {
          console.log ('MasterName address: ', networkData.address);
          var contract = new web3.eth.Contract(
            MasterName.abi,
            networkData.address,
          );
          setMasterName(contract);
        }
        */        

        /*
        } else {
          window.alert('Smart contract not deployed to detected network.');
        }
        */
      } catch (error) {
        console.error(error);
      }
    }
    loadWeb3().then(() => loadBlockchainData());
  }, []);
  
  const handleListAddressOwners = e => {
    e.preventDefault();

    masterName.methods.listNameOwners().call()
      .then( function(list) {
        console.log ('listAddressOwners: ', list);
        setListAddressOwners(list);
      });
  };


  const handleListNames = e => {
    e.preventDefault();
    
    let list = [];
    masterName.methods.listNameOwners().call()
      .then( function(owners) {
        //console.log ('listAddressOwners: ', owners);
        setListAddressOwners(owners);
        masterName.methods.listAddressNameSCs().call()
        .then( function(scs) {
          //console.log ('listAddressSCNames: ', scs);
          setListAddressSCNames(scs);          
          
          for(let i = 0; i < owners.length; i++ ) {
            masterName.methods.getNameSC(scs[i]).call()
            .then( function(name) {
              //console.log(owners[i], scs[i], name);
              let item = [owners[i], scs[i], name];
              //console.log ('item: ', item);
              list.push(item);
              setListNames(list);
              //setListNames(listNames => listNames.push(item));
            });
          }
          console.log ('list: ', list);
          //setListNames(list);
          setTest("Sol");
          console.log ('test: ', test);
          //console.log ('ListAddressOwners: ', listAddressOwners);
          //console.log ('ListAddressSCNames: ', listAddressSCNames);
        });
      });
  };


   
  
  return (
    <Container>
      <div className="App">

        <div>
          {account && <p>Your account: {account}</p>}
          {masterName && <p>MasterName: {masterName._address}</p>}
        </div>

        {test && <p>{test}</p>}        
        <Row>
          <Form onSubmit={handleListNames}>
            <Button type="submit">List Names</Button>
          </Form>
          {listNames && 
            <p>List: 
              {listNames.map((item) => 
                <li key={item.id}>{item[0]} - {item[1]} - {item[2]}</li>
                )}
            </p>
          }
        </Row>

      </div>
      
    </Container>

  );
}

export default App;
