'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

const Header = () => {
  const [back, setBack] = useState(null)
  useEffect(() => {
    const location = new URLSearchParams(window.location.search)
    const back = location.get('back')
    console.log('\n location', location, '\n back', back)
    setBack(back)
  }, [])

  return (<>
    <Navbar style={{ backgroundColor: '#FFB3AB' }}>
      <Container>
        {back 
          ? <Nav>
            <Nav.Link href={`https://cyclingfrog.com${back}`} className='d-flex p-2 justify-content-center align-items-center'>
              <i className='material-icons fs-6'>arrow_back</i> 
              Back
            </Nav.Link>
          </Nav>
          : <span style={{ width: '5ch'}}></span>
        }
        <Navbar.Brand>
          <a href="https://cyclingfrog.com">
            <Image 
              style={{ width: 'auto', height: '40px' }}
              alt='Cycling Frog Logo'
              src={'https://cyclingfrog.com/cdn/shop/files/CyclingFrog_CMYK_Logo-LeftAlignedStacked-Regulated-Black_300x.png?v=1710802940'}
              width={300}
              height={150}
            />
          </a>
        </Navbar.Brand>
        <span style={{ width: '5ch'}}></span>
      </Container>
    </Navbar>
  </>)
}

export default Header;
