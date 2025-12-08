'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const stickyThreshold = 100;
    const onScroll = () => {
      setIsScrolled(window.scrollY > stickyThreshold);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [])

  return (<>
    <Navbar style={{ backgroundColor: '#FFB3AB' }}>
      <Container>
        <Nav>
          <Nav.Link href="https://cyclingfrog.com" className='d-flex p-2 justify-content-center align-items-center'>
            <i className='material-icons'>arrow_back</i> 
            Back
          </Nav.Link>
        </Nav>
        <Navbar.Brand>
          <Image 
            style={{ width: 'auto', height: '40px' }}
            alt='Cycling Frog Logo'
            src={'https://cyclingfrog.com/cdn/shop/files/CyclingFrog_CMYK_Logo-LeftAlignedStacked-Regulated-Black_300x.png?v=1710802940'}
            width={300}
            height={150}
          />
        </Navbar.Brand>
        <span></span>
      </Container>
    </Navbar>
  </>)
}

export default Header;
