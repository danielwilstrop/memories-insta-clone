import React, { useState, useEffect } from 'react'
import M from 'materialize-css'

const EditPost = ({ oldTitle, oldBody, oldImage, itemId }) => { 
    const [ title, setTitle ] = useState(oldTitle)
    const [ body, setBody ] = useState(oldBody)
    const [ image, setImage ] = useState(oldImage)
    const [ url, setUrl ] = useState('')

    useEffect(() => {
        if(url){
            fetch(`/editpost/${itemId}`, {
                method: "put",
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
                    M.toast({ html: "Post Edited Successfully", classes: "#76ff03 light-green accent-3 toast-success"})
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
            console.log(url)
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
                    Edit Post </button>
        </div>
    )
}

export default EditPost
