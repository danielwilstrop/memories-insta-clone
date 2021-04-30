import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const SignUp = () => {
    const history = useHistory()
    const [ name, setName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ image, setImage ] = useState('')
    const [ url, setUrl ] = useState(undefined)
    const [ email, setEmail ] = useState('')
    const reg = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    useEffect(() => {
        if (url) {
            uploadData()
        }
  // eslint-disable-next-line 
    },[url])


    const uploadProfilePic = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "insta-clone-dan-wilstrop")
        fetch("https://api.cloudinary.com/v1_1/insta-clone-dan-wilstrop/image/upload", {
            method: "post",
            body: data
        })
        .then(repsonse => repsonse.json())
        .then(data => {
            setUrl(data.secure_url)
        })
        .catch(error => console.log(error))
    }

    const uploadData = () => {
        if (!reg.test(email)) {
            return M.toast({ html: "Invalid E-Mail", classes: "#e53935 red darken-1" })
         }
         fetch('/signup', {
             method: "post",
             headers: {
                 "Content-Type":"application/json"
             },
             body: JSON.stringify({
                 name,
                 email,
                 password,
                 confirmPassword,
                 pic: url
             })
         }).then(res => res.json())
            .then(data => {
                if (data.error){
                 M.toast({ html: data.error, classes: "#e53935 red darken-1" })
                }
                else {
                 M.toast({ html: data.message, classes: "#76ff03 light-green accent-3 toast-success"})
                 history.push('/login')
                }
            }).catch(error => console.log(error))
    }

    const PostData = () => {  
       if (image) {
           uploadProfilePic()
       } else {
           uploadData()
       }
    }

    return (
        <div className = 'my-card'>
            <div className="card auth-card input-field">
                <h2> Memories </h2>
                <input type = 'text'
                       placeholder = 'Name'
                       value = {name}
                       onChange = {e => setName(e.target.value)}
                        />
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
                 <input type = 'password'
                        placeholder = 'Confirm Password'
                        value = {confirmPassword}
                        onChange = {e => setConfirmPassword(e.target.value)}
                        />
                <div className = "file-field input-field">
                    <div className = "btn">
                        <span> <i className = "material-icons"> camera_alt </i></span><span className='padding'>Profile Pic</span>
                        <input type="file"
                            onChange = {(e) => setImage(e.target.files[0])}
                            />
                    </div>
                    <div className = "file-path-wrapper">
                        <input className = "file-path validate" type="text" />
                </div>
            </div>
                <button className="btn waves-effect waves-light #ff5722 deep-orange" onClick = {() => PostData()}> Register </button>
                <h5> <Link to = '/login'> Already have an account? </Link></h5>
            </div>
        </div>
    )
}
 
export default SignUp