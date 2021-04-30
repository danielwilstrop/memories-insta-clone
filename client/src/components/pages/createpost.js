import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router'

const CreatePost = () => {
    const history = useHistory() 
    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ image, setImage ] = useState('')
    const [ url, setUrl ] = useState('')

    useEffect(() => {
        if(url){
            fetch('/createpost', {
                method: "post",
                headers: {
                    "Content-Type":"application/json",
                    "authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    picture: url
                })
            }).then(res => res.json())
            .then(data => {
                if (data.error){
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" })
                }
                else {
                    M.toast({ html: "Post Created Successfully", classes: "#76ff03 light-green accent-3 toast-success"})
                    history.push('/')
                }
            }).catch(error => console.log(error))
        }
    // eslint-disable-next-line 
    },[url])
    

    const postDetails = () => {
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

    return (
        <div className = 'card input-field'
        style ={{ margin: "30px auto",
                  maxWidth: "360px",
                  padding: "20px",
                  textAlign: "center" }} >
            <input type = 'text'
                   placeholder = 'Post Title'
                   value = {title}
                   onChange = {(e) => setTitle(e.target.value)}
                   /> 
            <input type = 'text'
                   placeholder = 'Message'
                   value = {body}
                   onChange = {(e) => setBody(e.target.value)}
                   />
            <div className = "file-field input-field">
                <div className = "btn">
                    <span> <i className = "material-icons"> camera_alt </i> </span>
                    <input type="file"
                           onChange = {(e) => setImage(e.target.files[0])}
                           />
                </div>
                <div className = "file-path-wrapper">
                    <input className = "file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #ff5722 deep-orange"
                    onClick = {postDetails}> 
                    Create Post </button>
        </div>
    )
}

export default CreatePost
