import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [contacts, setContacts] = useState();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', surname: '', email: '', password: '', category: 'business', subCategory: 'Boss', phone: '', birthDate: '' });
    const [loginData, setLoginData] = useState({ login: '', password: '' })
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        populateContactsData();     // pobierania tokenow i danych z bazy
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser && savedUser !== 'undefined') {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    function validatePassword(password) {       // sprawdzenie czy haslo spelnia warunki: co najmniej 8 znakow
        const minLength = /.{8,}/;              // w tym co najmniej 1 duza i mala litera, cyfra i znak specjalny
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

    const ValChanged = (e) => {     // aktualizacja pol formularza dodawania
        setNewContact({ ...newContact, [e.target.name]: e.target.value });
    };

    const LoginChanged = (e) => {   //aktualizacja pol formularza logowania
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }

    const loging = async (e) => {       //logowanie
        e.preventDefault();
        try {       // wysylanie danych
            const response = await fetch('http://localhost:5223/api/contacts/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginData.login,
                    password: loginData.password
                })
            });
            if (response.ok) {      //poprawne zalogowanie - ustawienie tokenow i statusu aplikacji
                const data = await response.json();
                setIsLoggedIn(true);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                return data
            } else {
                alert("Wrong email / password")
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const fetchWithAuth = async (url, options = {}) => {
        const authToken = token || localStorage.getItem('token');

        if (!authToken) {
            logOut();
            return null;
        }

        const authOptions = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, authOptions);

            if (response.status === 401) {
                logOut();
                return null;
            }

            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    };



    const logOut = (e) => {     //wylogowanie
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
    }

    const deleteContactById = async (id) => {   //usuwanie kontaktu
        const response = await fetchWithAuth(`http://localhost:5223/api/contacts/${id}`, {
            method: 'DELETE'
        });

        if (response && response.ok) {
            setContacts(contacts.filter(contact => contact.id !== id));
        } else {
            alert('Deleting failed');
        }
    };


    const insertValues = async (e) => {
        e.preventDefault();

        if (validatePassword(newContact.password)) {
            const foundMail = contacts.find(contact => contact.email === newContact.email);
            if (foundMail === undefined) {
                const response = await fetchWithAuth('http://localhost:5223/api/contacts', {
                    method: 'POST',
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

                if (response && response.ok) {
                    const added = await response.json();
                    setContacts([...contacts, added]);
                    setNewContact({ name: '', surname: '', password: '', phone: '', email: '', category: 'business', subCategory: 'Boss', birthDate: '' });
                }
            } else {
                alert("This email already exists in database");
            }
        } else {
            alert("Inappropriate password");
        }
    };


    const editContact = async (id) => {
        const response = await fetchWithAuth(`http://localhost:5223/api/contacts/${id}`, {
            method: 'PUT',
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

        if (response && response.ok) {
            populateContactsData();
            setNewContact({ name: "", surname: "", password: "", email: "", category: "business", subCategory: "Boss", phone: "", birthDate: "" });
        }
    };


    const toggleInfo = (id) => { // wysywietlanie / chowanie dodatkowych informacji
        const el = document.getElementById(id);
        if (el) {
            el.style.display = el.style.display === "none" ? "table-row" : "none";
        }
    };

    const contents = contacts === undefined     //tabela z danymi
        ? <p><em>Loading... Please wait</em></p>
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
                            <td>{contact.name}</td>
                            <td>{contact.surname}</td>
                            <td><button onClick={() => toggleInfo(contact.id)}>Show more</button></td>
                            {isLoggedIn ? <><td><button onClick={() => deleteContactById(contact.id)}>Delete</button></td>
                                <td><button onClick={() => editContact(contact.id)}>Edit</button></td> </> : <></>}

                        </tr>
                        <tr id={contact.id} style={{ display: "none" }}>
                            <td>Email:  <br></br> {contact.email}</td>
                            <td>Hashed password: <br></br> {contact.password}</td>
                            <td>Category: <br></br>{contact.category}</td>
                            <td>Subcategory: <br></br> {contact.subCategory}</td>
                            <td>Phone: <br></br>{contact.phone}</td>
                            <td>Birthdate: <br></br>{contact.birthDate}</td>
                        </tr>
                    </>

                )}
            </tbody>
        </table>;

    const form1 =   //formularz do dodawania danych
        <form id="adding" onSubmit={insertValues}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={newContact.name} onChange={ValChanged} required />

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

    const loginForm =       //formularz do logowania
        <form id="loginForm" onSubmit={loging}>
            <label htmlFor="login">Login</label>
            <input type="text" id="login" name="login" value={loginData.login} onChange={LoginChanged} required></input>

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={loginData.password} onChange={LoginChanged} required></input>

            <button type="submit">Log in</button>
        </form>


    return (    // struktura aplikacji
        <div>
            <h1 id="tabelLabel">List of contacts</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {isLoggedIn ? <></> : loginForm}
            {contents}

            {isLoggedIn ? form1 : <></>}
            {isLoggedIn ? <p>You were sussesfully logged!</p> : <p>Log in to edit data</p>}
            {isLoggedIn ? <button onClick={logOut}>Log out</button> : <></>}
        </div>
    );

    async function populateContactsData() {     //pobieranie dancyh z bazy
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