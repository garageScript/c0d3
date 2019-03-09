import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import '../css/NavBar.css'
import smallLogo from '../assets/smallLogo.png'
import authClient from '../helpers/auth/client'

const NavBarComponent = ({ location }) => {
  if (location.pathname.includes('/chat')) return ''
  const authUserNavLinks = (
    <ul className='navbar-nav'>
      <li className='nav-item nb-space'>
        <Link to='/home' className='nav-link'>
          Home
        </Link>
      </li>
      <li className='nav-item nb-space'>
        <Link to='/profile' className='nav-link'>
          Profile
        </Link>
      </li>
      <li className='nav-item nb-space'>
        <Link to='/curriculum' className='nav-link'>
          Curriculum
        </Link>
      </li>
      <li className='nav-item nb-space'>
        <a href='https://chat.c0d3.com' className='nav-link'>
                Chat
        </a>
      </li>
      <li className='nav-item dropdown'>
        <div
          role='link'
          className='nav-link dropdown-toggle div-link'
          id='navbarDropdownMenuLink'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          Tools
        </div>
        <div
          className='dropdown-menu dropdown-menu-right'
          aria-labelledby='navbarDropdownMenuLink'
        >
          {/* Remove when Snippets have been moved to GraphQL
          <Link to="/snippets" className="nav-link dropdown-item">
            Snippets
          </Link>
          */}
          <a href='https://apps.c0d3.com' className='nav-link dropdown-item'>
            Apps
          </a>
          <a href='https://git.c0d3.com' className='nav-link dropdown-item'>
            Repo
          </a>
          <Link
            to='/'
            className='nav-link dropdown-item'
            onClick={() => {
              authClient.session.end(() => {
                window.location = '/'
              })
            }}
          >
            Sign Out
          </Link>
        </div>
      </li>
    </ul>
  )

  const nonAuthUserNavLinks = (
    <ul className='navbar-nav'>
      <li className='nav-item'>
        <Link to='/' className='nav-link'>
          Home
        </Link>
      </li>
      <li className='nav-item'>
        <Link to='/signin' className='nav-link'>
          Sign In
        </Link>
      </li>
      <li className='nav-item'>
        <Link to='/signup' className='nav-link'>
          Sign Up
        </Link>
      </li>
    </ul>
  )

  return (
    <nav className='navbar navbar-expand-lg sticky-top navbar-dark nav-bar accent-4'>
      <Link className='navbar-brand nb-space' to='/'>
        <img
          src={smallLogo}
          height='30'
          className='d-inline-block align-top nb-space'
          alt=''
        />{' '}
        C0D3
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon' />
      </button>
      <div
        className='collapse navbar-collapse justify-content-end'
        id='navbarSupportedContent'
      >
        {window.userInfo.id ? authUserNavLinks : nonAuthUserNavLinks}
      </div>
    </nav>
  )
}

const NavBar = withRouter(NavBarComponent)

export default NavBar
