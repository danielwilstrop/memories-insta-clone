import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Login = () => {
    const { dispatch } = useContext(UserContext)
    const history = useHistory()
    const [ password, setPassword ] = useState('')
    const [ email, setEmail ] = useState('')
    const reg = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const PostData = () => {  
        if (!reg.test(email)) {
           return M.toast({ html: "Invalid E-Mail", classes: "#e53935 red darken-1" })
        }
        fetch('/signin', {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                password,
            })
        }).then(res => res.json())
           .then(data => {
               console.log(data)
               if (data.error){
                M.toast({ html: data.error, classes: "#e53935 red darken-1" })
               }
               else {
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({ type:"USER", payload:data.user })
                M.toast({ html: "Signed In Successfully", classes: "#76ff03 light-green accent-3 toast-success"})
                history.push('/')
               }
           }).catch(error => console.log(error))
    }

    return (
        <div className = 'my-card'>
            <div className="card auth-card input-field">
                <h2> Memories </h2>
                <input type = 'text'
                        placeholder = 'E-Mail'
                        value = {email}
                        onChange = {e => setEmail(e.target.value)} 
                        />
                <input type = 'password'
                       placeholder = 'Password'
                       value = {password}
                       onChange = {e => setPassword(e.target.value)}
                        />
                <button className="btn waves-effect waves-light #ff5722 deep-orange"
                        onClick = {() => PostData()}>Log In</button>
                <h5> <Link to = '/signup'> Don't have an account? </Link></h5>
            </div>
        </div>
    )
}

export default Login
