import Image from 'next/image'
import { Container, Nav, Navbar } from 'react-bootstrap'

const Header = () => {
  return (<>
    <Navbar style={{ backgroundColor: '#FFB3AB' }}>
      <Container>
        <Nav>
          <Nav.Link href="https://cyclingfrog.com" className='d-flex p-2 justify-content-center align-items-center'>
            <i className='material-icons fs-6'>arrow_back</i> 
            Back
          </Nav.Link>
        </Nav>
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
