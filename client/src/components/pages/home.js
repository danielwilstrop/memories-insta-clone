import React, { useState, useEffect, useContext } from 'react'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'
import EditPost from '../editPost'

const Home = () => {
    const [data, setData] = useState([])
    const { state } = useContext(UserContext)

    useEffect(() => {
        if(state){
        fetch('/getsubpost', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(response => response.json())
          .then(result => {
              setData(result.posts) 
          })}
    },[data])

    const like = (id) => {
        fetch('/like', {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
          .then(result => {
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
          }).catch(error => {
              console.log(error)
          })
    }

    const unlike = (id) => {
        fetch('/unlike', {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
          .then(result => {
              const newData = data.map(item => {
                  if (item._id === result._id) {
                      return result
                  } else {
                      return item
                  }
              })
              setData(newData)
          }).catch(error => {
            console.log(error)
        })
    }

    const leaveComment = (text, postId) => {
        if (!text){
            return null
        }
        fetch('/comment', {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json)
          .then(result => {
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
          }).catch(error => console.log(error))
    }

    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    const deleteComment = (postid, commentid) => {
        fetch(`/deletecomment/${postid}/${commentid}`, {
          method: "delete",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((result) => {
                 const newData = data.map((item) => {
    
              if (item._id === result._id) {
                         return result;
              } else {
                return item;
              }
            });
            setData(newData);
          });
      };

      const editPost = (item) => {
      const modal = document.querySelectorAll('.edit-modal')
       modal.forEach(div => {
           if (div.title === item){
               div.classList.toggle('hide')
               const yOffset = -25
               const y = div.getBoundingClientRect().top + window.pageYOffset + yOffset
               window.scrollTo({ top:y, behavior:'smooth' })
           }
       })
      }
    
    
    return (
       <div className = 'home input-field'>
           {data.map(item => {
            return (
                <>
                <div key = {item._id} className = 'hide edit-modal' title = {item._id}>
                        <EditPost oldBody = {item.body}
                        oldTitle = {item.title}
                        oldImage = {item.picture}
                        itemId = {item._id}
                        />
                </div>
                <div className = 'card home-card' key = {item._id * 2}>
                    <h5><Link to = {item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : "/profile"}>{item.postedBy.name}</Link>
                    {item.postedBy._id === state._id && <i className ='material-icons' style ={{float: 'right'}} onClick ={() => deletePost(item._id)}>delete</i>}
                    {item.postedBy._id === state._id && <i className ='material-icons' style ={{float: 'right'}} onClick ={() => editPost(item._id)}>edit</i>}
                    </h5>
                    <div className = 'card-image'>
                        <img src = {item.picture} alt = 'memories' />
                    </div>
                    <div className = 'card-content'>
                        {item.likes.includes(state._id)
                        ? <i className = "material-icons"
                             onClick = {() => unlike(item._id)}
                             style = {{ color:'red' }}>
                             favorite </i>
                        : <i className = "material-icons" 
                             onClick = {() => like(item._id)}> 
                             favorite_border </i>
                        }
                        <h6> {item.likes.length} Likes </h6>
                        <h6> {item.title} </h6>
                        <p> {item.body} </p>
                        <div className = 'comments'>
                            {   // slight fix to get auto scroll without a library
                                item.comments.slice(0).reverse().map((comment) => {
                                    return <h6 key={comment._id}>
                                    <span style={{ fontWeight: "500" }}>
                                      {comment.postedBy.name}
                                    </span>{" "}
                                    {comment.text}
                                    {( comment.postedBy._id) === state._id && 
                                    (
                                      <i
                                        className="material-icons"
                                        style={{
                                          float: "right",
                                          fontSize: "1.2rem"
                                        }}
                                        onClick={() => deleteComment(item._id, comment._id)}
                                        >
                                        delete
                                      </i>
                                    )}
                                  </h6>
                                })
                            }
                        </div>
                        <form onSubmit = {(e) => {
                                  e.preventDefault()
                                  leaveComment(e.target[0].value, item._id)
                                  e.target[0].value = null
                              }}
                              className = 'form'>
                          <input type = 'text' placeholder = 'Add a comment...' />
                          <button type = 'submit' className = 'logout'> <i className = "material-icons"> chat_bubble </i> </button>
                        </form>
                    </div>
                </div>
                </>
            )
           })}
       </div>
    )
}

export default Home
