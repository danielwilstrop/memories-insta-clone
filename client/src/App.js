import { createContext, useEffect, useReducer, useContext } from 'react'
import './App.css';
import Nav from './components/nav'
import Home from './components/pages/home'
import Login from './components/pages/login'
import SignUp from './components/pages/signup'
import Profile from './components/pages/profile'
import CreatePost from './components/pages/createpost'
import Error from './components/pages/error'
import UserProfile from './components/pages/userProfile'
import FollowingPosts from './components/pages/followingPosts';
import {reducer, initialState}from './reducers/userReducer'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'

export const UserContext = createContext()

const Routes = () => {
  const history = useHistory()
  const { dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user){
      dispatch({ type:"USER", payload:user })
    } else {
      history.push('/login')
    }
  // eslint-disable-next-line 
  },[])

  return (
    <Switch>
    <Route exact path = '/'>
        <Home />
      </Route>
      <Route path = '/signup'>
        <SignUp />
      </Route>
      <Route path = '/login'>
        <Login />
      </Route>
      <Route exact path = '/profile'>
        <Profile />
      </Route>
      <Route path = '/create'>
        <CreatePost />
      </Route>
      <Route path = '/profile/:userId'>
        <UserProfile />
      </Route>
      <Route path = '/followingposts'>
        <FollowingPosts />
      </Route>
      <Route path = '*'>
        <Error />
      </Route>
    </Switch>
  )
}

const App = () => {
  const [ state, dispatch ] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value = {{ state,dispatch }}>
      <BrowserRouter>
        <Nav />
        <Routes />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
