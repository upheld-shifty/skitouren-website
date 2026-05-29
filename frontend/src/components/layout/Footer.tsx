export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="site-footer__inner">
          <span>Schweizer Tourenberichte</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
