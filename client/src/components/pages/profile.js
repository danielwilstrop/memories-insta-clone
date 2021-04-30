import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

const Profile = () => {
    const [ pics, setPics ] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [ image, setImage ] = useState('')
    const modal = document.querySelector('.modal-wrapper')

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(response => response.json())
          .then(result => {
              setPics(result.myposts)
          })
    },[])

    useEffect(() => {
        if(image){
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
                fetch('/updateprofilepic', {
                    method: 'put',
                    headers: {
                        "Content-Type":"application/json",
                        "authorization":"Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({ pic:data.url })
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    localStorage.setItem('user', JSON.stringify({ ...state, pic:result.pic }))
                    dispatch({ type:'UPDATEPROFILEPIC', payload:result.pic })
                })
                modal.style.display = 'none'
            })
            .catch(error => console.log(error))
        }
     // eslint-disable-next-line 
    },[image])

    const showModal = () => {
        modal.style.display = 'flex'
    }

    return (
       <div style = {{ maxWidth: "770px", margin: "0px auto"}}>
           <div style = {{
               display: "flex",
               justifyContent: "space-around",
               margin: "18px 0px",
               borderBottom: "1px solid grey"
           }}>
               <div>
                   <img style = {{width:'140px', height:'140px', borderRadius: '80px'}} alt = 'profile'
                    src = {state ? state.pic : "Loading..."} />
                    <i className='material-icons upload-pic' onClick = {() => showModal()}>add</i>
               </div>
               <div>
                   <h4> {state? state.name : "Loading"} </h4>
                   <h5> {state? state.email : "Loading"} </h5>
                    <div style ={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                        <h6> {pics.length} Posts </h6> 
                        <h6> {state ? state.following.length -1 : "0"} Following </h6> 
                        <h6> {state ? state.followers.length : "0"} Followers </h6> 
                    </div>
               </div>
           </div>
           <div className = 'modal-wrapper'>
             <div className="card auth-card input-field modal"></div>
                <div className = "file-field input-field">
                    <div className = "btn">
                        <span> <i className = "material-icons"> camera_alt </i></span>
                        <input type="file"
                            onChange = {(e) => setImage(e.target.files[0])}
                        />
                     </div>
                    </div>
                    <div className = "file-path-wrapper">
                        <input className = "file-path validate" type="text" />
                    </div>
            </div>
       <div className ="gallery">
           {pics.map((item, index) => {
               return (
                   <img className = 'item'
                        key = {index}
                        alt = 'grid'
                        src = {item.picture}/>
               )
           })}
        </div>
       </div>
    )
}

export default Profile
