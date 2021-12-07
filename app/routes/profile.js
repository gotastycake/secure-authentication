import { decryptData, encryptData, isLogged } from '../controllers/middleware.js';
import express from 'express';

const router = express.Router();

router.get('/', isLogged, (req, res) => {
    const { user } = req;
    const { username, email: emailEncrypted, phone: phoneEncrypted } = user;
    const decryptedData = decryptData(user, emailEncrypted, phoneEncrypted);
    const [ email = '[malformed]', phone = '[malformed]' ] = decryptedData;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
                <meta charset="UTF-8">
                <title>Title</title>
            </head>
            <body>
                <div class="container-md" style="padding-top: 1rem">
                    <div id="alert_success" hidden class="alert alert-success animate__animated" role="alert" style="float: right; margin-right: -3rem;">Saved successfully!</div>
                    <div id="alert_danger" hidden class="alert alert-danger animate__animated" role="alert" style="float: right; margin-right: -3rem;">Server Error: </div>
                    
                    
                    <p class="h1">Profile: ${username}</p>
                    <br>
                    <a class="btn btn-primary" style="margin-bottom: 2rem" href="/dashboard">Dashboard</a>
                    <a class="btn btn-primary" style="margin-bottom: 2rem" href="/logout">Log Out</a>
                    <p class="h4">Email address: <input readonly id="email" style="border: 0; outline: none; height: 100%;" value="${email || 'none'}"></p>
                    <p class="h4">Phone number: <input readonly id="phone" style="border: 0; outline: none; height: 100%;" value="${phone || 'none'}"></p>
                    <button id="editButton" class="btn btn-primary" style="margin-top: 1rem" onclick="edit()">Edit</button>
                    <button id="saveButton" hidden class="btn btn-primary" style="margin-top: 1rem" onclick="save()">Save</button>

                </div>
            </body>
            <script>
                let isEditing = false;
                let prevEmail, prevPhone;
                
                const emailElement = document.getElementById('email');
                const phoneElement = document.getElementById('phone');
                const editButton = document.getElementById('editButton');
                const saveButton = document.getElementById('saveButton');
                
                const edit = (isSaved = false) => {
                    if (!isEditing) {
                        emailElement.removeAttribute('readonly');
                        emailElement.style.outline = 'auto';
                       
                        phoneElement.removeAttribute('readonly');
                        phoneElement.style.outline = 'auto';
                        editButton.innerText = 'Cancel';
                        prevEmail = emailElement.value;
                        prevPhone = phoneElement.value;
                       
                        saveButton.removeAttribute('hidden');
                    } else {
                        emailElement.setAttribute('readonly', '');
                        emailElement.style.outline = 'none';
                       
                        phoneElement.setAttribute('readonly', '');
                        phoneElement.style.outline = 'none';
                        editButton.innerText = 'Edit';
                        if (!isSaved) {
                            emailElement.value = prevEmail;
                            phoneElement.value = prevPhone;                            
                        }
                       
                        saveButton.setAttribute('hidden', '');
                    }
                    isEditing = !isEditing;
                };
                
                const save = () => {
                    const email = emailElement.value;
                    const phone = phoneElement.value;
                   
                    const body = { email, phone };
                    
                    const options = {
                        method: 'POST',
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                          'Content-Type': 'application/json'
                          // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrerPolicy: 'no-referrer', // no-referrer, *client
                        body: JSON.stringify(body) // body data type must match "Content-Type" header
                    };

                    fetch('/profile', options).then(res => {
                        if (res.status === 200) {
                            const alert = document.getElementById('alert_success');
                            showAlert(alert);
                            edit(true);
                        }
                        return Promise.reject(res.status);
                    }).catch(err => {
                        const alert = document.getElementById('alert_danger');
                        alert.innerText = 'Server Error: ' + err;
                        showAlert(alert);
                    });
                };

                let animated = false;
                const showAlert = alertElement => {
                    if (!animated) {
                        animated = true;
                        alertElement.removeAttribute('hidden');
                        alertElement.classList.remove('animate__fadeOutUp');
                        alertElement.classList.add('animate__fadeInDown');
                        setTimeout(() => {
                            alertElement.classList.remove('animate__fadeInDown');
                            alertElement.classList.add('animate__fadeOutUp');
                            animated = false;
                        }, 2000);
                    }
                };

            </script>
        </html>
    `);
});

router.post('/', isLogged, (req, res) => {
    const funcName = '[Profile save]';

    const { body: { email, phone }, user } = req;

    if (!email || !phone) {
        return res.status(400).end();
    }

    const [ emailEncrypted, phoneEncrypted ] = encryptData(user, email, phone);
    console.log(emailEncrypted, phoneEncrypted);
    user.email = emailEncrypted;
    user.phone = phoneEncrypted;

    user.save().then(() => {
        console.log('Saved data', user.username);
        return res.status(200).end();
    }).catch(err => {
        console.error(funcName, user.username, err);
        return res.status(500).end();
    });
});

export default router;