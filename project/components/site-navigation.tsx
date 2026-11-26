'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { siteLinks } from '@/lib/site-links'

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>
}

export function SiteNavigation() {
  const [activeId, setActiveId] = useState('ecosystem')

  useEffect(() => {
    const sections = siteLinks
      .map(([, href]) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible) setActiveId(visible.target.id)
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return <>
    <aside className="sidebar" aria-label="Main navigation">
      <Link className="brand" href="#top" aria-label="Unimarky home"><Mark /><span>unimarky</span></Link>
      <span className="side-label">CAMPUS LIFE</span>
      <nav className="side-nav">{siteLinks.map(([label, href], index) => {
        const id = href.slice(1)
        return <a className={activeId === id ? 'active' : ''} aria-current={activeId === id ? 'location' : undefined} key={id} href={href}><span className="nav-index">0{index + 1}</span>{label}</a>
      })}</nav>
      <div className="side-bottom"><a href="#login">Log in <ArrowUpRight size={14} /></a><a href="#signup">Sign up <ArrowUpRight size={14} /></a></div>
    </aside>
    <header className="mobile-header">
      <Link className="brand" href="#top"><Mark /><span>unimarky</span></Link>
      <details className="mobile-menu"><summary aria-label="Open navigation"><Menu size={21} /><X size={21} /></summary><nav>{siteLinks.map(([label, href]) => <a href={href} key={href}>{label}<ArrowUpRight size={14} /></a>)}<a href="#login">Log in</a><a href="#signup">Sign up</a></nav></details>
    </header>
  </>
}
