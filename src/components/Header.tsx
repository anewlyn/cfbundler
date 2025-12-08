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

  return (
    <Navbar>
      <Container>
        <Nav>
          <Nav.Link href="https://cyclingfrog.com">
            <- Back
          </Nav.Link>
        </Nav>
        <Navbar.Brand>
          <Image 
            style={{ height: '40px' }}
            alt='Cycling Frog Logo'
            src={'https://cyclingfrog.com/cdn/shop/files/CyclingFrog_CMYK_Logo-LeftAlignedStacked-Regulated-Black_300x.png?v=1710802940'}
            width={300}
            height={150}
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
