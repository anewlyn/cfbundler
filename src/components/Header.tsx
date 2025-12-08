'use client'
import { useLoopContext } from '@/contexts/LoopProvider'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

// progress uses svg dash-array/offset in px, not traditional 0-100% progress calculation.
const maxProgress = 200.96
const minProgress = 0

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { benefitTiers, currentOrderValue } = useLoopContext()
  const [progress, setProgress] = useState(maxProgress)

  useEffect(() => {
    const stickyThreshold = 100;
    const onScroll = () => {
      setIsScrolled(window.scrollY > stickyThreshold);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [])

  useEffect(() => {
    const topTier = benefitTiers[benefitTiers.length - 1].value
    console.log('currentOrderValue', currentOrderValue)
    console.log('maxProgress - (currentOrderValue / topTier)', maxProgress - (currentOrderValue / topTier))
    console.log('progress', progress)
    if(currentOrderValue > topTier) setProgress(minProgress)
    if(currentOrderValue <= topTier) setProgress(maxProgress - (maxProgress * currentOrderValue / topTier))
  }, [currentOrderValue])

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
        {benefitTiers &&
          <div className="cf-bundle-progress" style={{ position: 'fixed'}}>
            <div className="cf-bundle-progress-discount cf-text-heading cf-uppercase">
              <span className="cf-bundle-progress-discount-percentage">10%</span>
              <span>Off</span>
            </div>
            <svg className="cf-bundle-progress-bar" width="64px" height="64px" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)'}}>
              <circle r="32" cx="36" cy="36" fill="transparent" stroke="#ffb3ab" stroke-width="8"></circle>
              <circle r="32" cx="36" cy="36" fill="transparent" stroke="#000000" stroke-width="8" stroke-linecap="round" stroke-dashoffset={progress} stroke-dasharray={maxProgress}></circle>
            </svg>
          </div>
        }
      </Container>
    </Navbar>
  </>)
}

export default Header;
