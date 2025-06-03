import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', surname: '', email:'', password: '', category: 'business', subCategory: 'Boss', phone: '', birthDate: '' });
    const [loginData, setLoginData] = useState({login: '', password: ''  })

    useEffect(() => {
        populateContactsData();
    }, []);

    function validatePassword(password) {
        const minLength = /.{8,}/;
        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasDigit = /[0-9]/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

        return (
            minLength.test(password) &&
            hasUppercase.test(password) &&
            hasLowercase.test(password) &&
            hasDigit.test(password) &&
            hasSpecialChar.test(password)
        );
    }

    const ValChanged = (e) => {
        setNewContact({ ...newContact, [e.target.name]: e.target.value });
    };

    const LoginChanged = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }

    const loging = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5223/api/contacts/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginData.login,
                    password: loginData.password
                })
            });
            if (response.ok) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
        }
    };
    

    const logOut = (e) => {
        e.preventDefault();
        setIsLoggedIn(false);
    }

    const deleteContactById = async (id) => {
        const response = await fetch(`http://localhost:5223/api/contacts/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            setContacts(contacts.filter(contact => contact.id !== id));
        } else {
            alert('Deleting failed');
        }
    };


    const insertValues = async (e) => {
        e.preventDefault();

        if (validatePassword(newContact.password)) {
            const foundMail = contacts.find(contact => contact.email === newContact.email)
            if (foundMail === undefined) {
                const response = await fetch('http://localhost:5223/api/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({

                        Name: newContact.name,
                        Surname: newContact.surname,
                        Email: newContact.email,
                        Password: newContact.password,
                        Category: newContact.category,
                        SubCategory: newContact.subCategory,
                        Phone: newContact.phone,
                        BirthDate: newContact.birthDate
                    })
                });
                if (response.ok) {
                    const added = await response.json();
                    setContacts([...contacts, added]);
                    setNewContact({ name: '', surname: '', password: '' });
                }
            }
            else {
                alert("This email already exists in database")
            }
        }
        else {
            alert("Unapropriate password")
        }
    };

    const editContact = async (id) => {
        //e.preventDefault();
        const response = await fetch(`http://localhost:5223/api/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({

                Name: newContact.name,
                Surname: newContact.surname,
                Email: newContact.email,
                Password: newContact.password,
                Category: newContact.category,
                SubCategory: newContact.subCategory,
                Phone: newContact.phone,
                BirthDate: newContact.birthDate
            })
        })
        if (response.ok) {
            setContacts([...contacts])
            setNewContact({ name: "", surname: "", password: "" });
        }
    }

    const toggleInfo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = el.style.display === "none" ? "table-row" : "none";
        }
    };

    const contents = contacts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Show</th>
                    {isLoggedIn ? <><th>Delete</th>
                        <th>Edit</th></> : <></>}
                </tr>
            </thead>
            <tbody>
                {contacts.map(contact =>
                    <>
                <tr key={contact.id}>
                    <td>{ contact.name}</td>
                    <td>{contact.surname}</td>
                    <td><button onClick={() => toggleInfo(contact.id)}>Show more</button></td>
                    {isLoggedIn ? <><td><button onClick={() => deleteContactById(contact.id)}>Delete</button></td>
                            <td><button onClick={() => editContact(contact.id)}>Edit</button></td> </> : <></>  }
                          
                </tr>
                <tr id={contact.id} style={{ display: "none" }}>
                            <td>{contact.email}</td>
                            <td>{contact.password}</td>
                            <td>{contact.category}</td>
                            <td>{contact.subCategory}</td>
                            <td>{contact.phone}</td>
                            <td>{contact.birthDate}</td>
                </tr>
                    </>
                    
                )}
            </tbody>
        </table>;

    const form1 = 
        <form id="adding" onSubmit={insertValues }>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name = "name" value={newContact.name} onChange={ValChanged} required/>

        <label htmlFor="surname">Surname</label>
            <input type="text" id="surname" name="surname" value={newContact.surname} onChange={ValChanged} required />

        <label htmlFor="pass">Password</label>
            <input type="text" id="pass" name="password" value={newContact.password} onChange={ValChanged} required />
        <label htmlFor="email">E-mail</label>
            <input type="text" id="email" name="email" value={newContact.email} onChange={ValChanged} required />
        <br></br>
       <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="pass" name="phone" value={newContact.phone} onChange={ValChanged} required />

        <label htmlFor="category">Category</label>
            <select name="category" value={newContact.category} onChange={ValChanged}>
                {categories.map(category =>
                    <>
                        <option value={category.name}> {category.name} </option>
                    </>
                )}
            </select>

            {newContact.category == "business" ? <>
                    <label htmlFor="subCategory">subCategory</label>
                <select name="subCategory" value={newContact.subCategory} onChange={ValChanged}>
                    {subCategories.map(subCategory => <>
                        <option value={subCategory.name}> {subCategory.name} </option>
                       </>)}
                </select>
            </> : <></>
            }
            {newContact.category == "other" ? <>
                <label htmlFor="subCategory">subCategory</label>
                <input type="text" id="subCategory" name="subCategory" value={newContact.subCategory} onChange={ValChanged} required />
            </> : <></>
            }


        <label htmlFor="birthDate">Date of birth</label>
            <input type="date" id="birthDate" name="birthDate" value={newContact.birthDate} onChange={ValChanged} required />

            <button type="submit">Add</button>
        </form>

    const loginForm = 
        <form id="loginForm" onSubmit={loging }>
            <label htmlFor="login">Login</label>
            <input type="text" id="login" name="login" value={loginData.login} onChange={LoginChanged } required></input>

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={loginData.password} onChange={LoginChanged} required></input>

            <button type="submit">Log in</button>
        </form>


    return (
        <div>
            <h1 id="tabelLabel">List of contacts</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {isLoggedIn ? <></> : loginForm }
            {contents}

            {isLoggedIn ? form1 : <></>}
            {isLoggedIn ? <p>You were sussesfully logged!</p> : <p>Log in to edit data</p>}
            {isLoggedIn ? <button onClick={logOut}>Log out</button> : <></> }
        </div>
    );

    async function populateContactsData() {
        const response = await fetch('http://localhost:5223/api/contacts');
        const data = await response.json();
        setContacts(data);

        const response2 = await fetch('http://localhost:5223/api/categories');
        const data2 = await response2.json();
        setCategories(data2);

        const response3 = await fetch('http://localhost:5223/api/subCategories');
        const data3 = await response3.json();
        setSubCategories(data3);
    }


}

export default App;