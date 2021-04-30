import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const Nav = () => {
    const { state, dispatch } = useContext(UserContext)
    const [ search, setSearch ] = useState('')
    const [ users, setUsers ] = useState([])
    const history = useHistory()
    const searchModal = useRef(null) 

    useEffect(() => {
      M.Modal.init(searchModal.current)
    },[])

    const logOut = () => {
      localStorage.clear()
      dispatch({ type: "CLEAR" })
      history.push('/login')
    }

    const renderList = () => {
      if (state){
        return [
          <li key = '11'> <i data-target = 'modal1' className ='material-icons modal-trigger' style = {{color:'black'}}>search</i> </li>,
          <li key = '0'><Link to="/profile">Profile</Link></li>,
          <li key = '1'><Link to="/create">New Post</Link></li>,
          <li key = '2'>
            <Link to = '#'><button className = 'logout' 
                    onClick = {() => logOut()}> 
                    Log Out
            </button></Link>
          </li>
        ]
      } else {
        return [
          <li key = '3'><Link to="/login">Log In</Link></li>,
          <li key = '4'><Link to="/signup">Sign Up</Link></li>
        ]
      }
    }

    const mobileMenu = () => {
      const nav = document.querySelector('.side')
      nav.classList.toggle('show')
    }

    const fetchUsers = (query) => {
      setSearch(query)
      fetch('search-users', {
        method: 'post',
        headers: {
          "Content-Type":"application/json",
          "authorization":"Bearer " + localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          query
        })
      })
      .then(res => res.json())
      .then(results => {
        setUsers(results.user)
      })
    }
 
    return (
      <>
      <nav>
        <div className="nav-wrapper white">
          <Link to= {state ? "/" : "/login"} className="brand-logo left"> &nbsp; Memories </Link>
          <button onClick = {mobileMenu} className="sidenav-trigger right"><i className="material-icons">menu</i></button>                             
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>

      <nav className = 'side'>
        <div className = "nav-wrapper white">
            <ul id="nav-mobile" className="right">
             {renderList()}
            </ul>
        </div>

        <div id="modal1" className="modal" ref = {searchModal} style ={{ color:'black' }}>
          <div className="modal-content input-field">
          <input type = 'text'
                        placeholder = 'Search Friends'
                        value = {search}
                        onChange = {e => fetchUsers(e.target.value)} 
                        />
                   <ul className="collection">
                     {users.map(user => {
                       return <li className="collection-item"
                                  key = {user._id}>
                                  <Link to = {user._id !== state._id ? `/profile/${user._id}`: '/profile'} 
                                        onClick = {() => {M.Modal.getInstance(searchModal.current).close()
                                        setSearch('')
                                        }}>
                                    <p>{user.name}</p>
                                    <img src = {user.pic} alt = {user._id} style = {{ height:'40px', width: '40px', borderRadius: '50%'}} />
                                  </Link>
                                  </li>
                     })} 
                    </ul>
          </div>
          <div className="modal-footer">
            <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick = {() => setSearch('')}>Close</button>
          </div>
        </div>
      </nav>

      </>
      
      
    )
}

export default Nav
