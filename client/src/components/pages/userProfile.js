import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
    const [ userProfile, setUserProfile ] = useState(null)
    const { userId } = useParams()
    const { state, dispatch } = useContext(UserContext)
    
    useEffect(() => {
        fetch(`/user/${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(response => response.json())
          .then(result => {
              setUserProfile(result)
          })
    },[userId])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userId
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setUserProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
        })
    }

    const unFollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unFollowId:userId
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setUserProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
        })
    }

    return (
        <>
        {userProfile ? 
            <div style = {{ maxWidth: "770px", margin: "0px auto"}}>
            <div style = {{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style = {{width:'140px', height:'140px', borderRadius: '80px'}} alt = 'profile'
                     src  = {userProfile.user.pic} />
                </div>
                <div>
                    <h4> {userProfile.user.name} </h4>
                    <h6> {userProfile.user.email} </h6>
                     <div style ={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                         {userProfile.posts.length === 1 ? <h6> {userProfile.posts.length} Post </h6> : <h6> {userProfile.posts.length} Posts </h6> } 
                         <h6> {userProfile.user.following.length -1 } Following </h6> 
                         <h6> {userProfile.user.followers.length} Followers </h6> 
                     </div>
                     {!state.following.includes(userId) ? 
                        <button className="btn waves-effect waves-light #ff5722 deep-orange"
                        style ={{ marginBottom: '0.6rem'}}
                        onClick = {() => followUser()}> Follow </button>
                      :
                      <button className="btn waves-effect waves-light #ff5722 deep-orange"
                      style ={{ marginBottom: '0.6rem'}}
                      onClick = {() => unFollowUser()}> Unfollow </button>
                    
                     }
                </div>
            </div>
        <div className ="gallery">
            {userProfile.posts.map((item, index) => {
                return (
                    <img className = 'item'
                         key = {index}
                         alt = 'grid'
                         src = {item.picture}/>
                )
            })}
         </div>
        </div>
        
        : <h2> Loading... </h2>}
       
       </>
    )
}

export default UserProfile
