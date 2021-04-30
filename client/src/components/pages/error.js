import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
    return (
        <div className = 'error'>
            <h2> 404 - Page not Found </h2>
            <button className="btn waves-effect waves-light #ff5722 deep-orange">
                <Link to = '/'> Home </Link>
            </button>
        </div>
    )
}

export default Error
