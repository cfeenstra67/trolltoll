import Container from 'react-bootstrap/Container'
import { CookiesProvider } from 'react-cookie'
import { Link } from 'react-router-dom'

import './Layout.scss'
import DarkMode from './DarkMode'
import RecentlyViewed from './RecentlyViewed'

export default function Layout({ children }) {
  return (
    <CookiesProvider>
      <DarkMode />
      <Container>
        <div className="layout-container">
          <Link to="/" className="brand">
            <img src="/troll.png" alt="Troll" />
            Troll Toll
          </Link>
          <hr/>
          {children}
          <hr/>
          <RecentlyViewed />
        </div>
      </Container>
    </CookiesProvider>
  )
}
