import React, {useState} from 'react';

function Register()
{
    const app_name = 'cop4331-1';
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else
        {
            return 'http://localhost:5000/' + route;
        }
    }
    
    var firstName;
    var lastName;
    var registerName;
    var registerPassword;
    var email;
    
    const [message,setMessage] = useState('');

    const doRegister = async event =>
    {
        event.preventDefault();

        var obj = {firstName:firstName.value, lastName:lastName.value, login:registerName.value, password:registerPassword.value, email:email.value};
        var js = JSON.stringify(obj);
        
        try
        {
            const response = await fetch(buildPath('api/register'),
                {method: 'POST', body:js, headers:{'Content-Type': 'application/json'}});

                var res = JSON.parse(await response.text());
            

            if(!res.success)
            {
                setMessage('Registration error: ' + res.error);
            }
            else
            {
                setMessage('Registration Successful');
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };

    return(
        <div id="registerDiv">
            <form onSubmit={doRegister}>
            <span id="inner-title">PLEASE Register</span><br/>
            <input type="text" id="firstName" placeholder="firstName" ref={(c) => firstName = c} /><br />
            <input type="text" id="lastName" placeholder="lastName" ref={(c) => lastName = c} /><br />
            <input type="text" id="registerName" placeholder="Username" ref={(c) => registerName = c} /><br />
            <input type="text" id="email" placeholder="Email" ref={(c) => email = c} /><br />
            <input type="password" id="registerPassword" placeholder="Password" ref={(c) => registerPassword = c} /><br />
            <input type="submit" id="registerButton" class="buttons" value="Register" onClick={doRegister} />
            </form>
            <span id="loginResult">{message}</span>
        </div>
    );
};

export default Register;