import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster, Position } from '@blueprintjs/core';
import './App.css';
import '@blueprintjs/core/lib/css/blueprint.css';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWebsite, setNewWebsite] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => setUsers(json))
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          AppToaster.show({
            message: 'User added successfully',
            intent: 'success',
            timeout: 3000,
          })
          setNewName("");
          setNewEmail("");
          setNewWebsite("");
        })
        // .catch((err) => {
        //   AppToaster.show({
        //     message: 'Failed to add user',
        //     intent: 'danger',
        //   });
        // });
    }
  }
    function OnChangeHandler(id,key,value){
      setUsers((users)=>{
        return users.map(user=>{
          return user.id == id?{...user,[key]:value}:user;
        })
      })

    }

    function updateUser(id){
      const user=users.find((user)=> user.id===id);
      fetch(`https://jsonplaceholder.typicode.com/users/10`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })
        // .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          AppToaster.show({
            message: 'User updated successfully',
            intent: 'success',
            timeout: 3000,
          })
        
        })
     }
    function deleteUser(id){
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, 
        {
        method: 'DELETE',
        })
     
        .then((data) => {
          
          setUsers((users)=>{
          return users.filter(user=>user.id !== id )
          })

         
          AppToaster.show({
            message: 'User deleted successfully',
            intent: 'success',
            timeout: 3000,
          })
        
        })

    }


  return (
    <div className="App">
      <table className="bp4-html-table bp4-html-table-bordered bp4-html-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>WEBSITE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td><EditableText onChange={value => OnChangeHandler(user.id,'email',value)} value={user.email} /></td>
              <td><EditableText onChange={value => OnChangeHandler(user.id,'website',value)} value={user.website} /></td>
              <td>
                <Button intent="primary" onClick={()=>updateUser(user.id)} >UPDATE</Button>{' '}
                <Button intent="danger" onClick={()=>deleteUser(user.id)} >DELETE</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter name..."
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email..."
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="Enter website..."
              />
            </td>
            <td>
              <Button intent="success" onClick={addUser}>Add User</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
