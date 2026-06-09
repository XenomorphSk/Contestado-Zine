import { useState, useMemo, useEffect } from 'react'
import data from './data.json'
import './index.css'

type MediaType = 'Livro' | 'Zine'

interface MediaItem {
  name: string
  type: MediaType
  path: string
  cover?: string // Optional cover image path
}

interface FriendItem {
  name: string
  url: string
  image: string // Image URL for the friend
}

const PLACEHOLDER_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300' fill='%23e0e0e0'%3E%3Crect width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239e9e9e'%3ENo Cover%3C/text%3E%3C/svg%3E";
const PLACEHOLDER_FRIEND_IMAGE = "https://via.placeholder.com/50?text=Amigo"; // Generic placeholder for friend images
const DEFAULT_LOGO_ALT = "Logo Contestadozine"; // Alt text for the main logo

function App() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<'Todos' | MediaType | 'Contos' | 'Incontestado'>('Todos')
  const [currentPage, setCurrentPage] = useState<'home' | 'biography'>('home')
  const [currentPhrase, setCurrentPhrase] = useState(0)

  const phrases = useMemo(() => [
    "Desde 2002 cutucando feridas",
    "Escritos que não se curvam",
    "Leia no Contestado Zine"
  ], [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [phrases.length])

  const allMedia: MediaItem[] = useMemo(() => {
    // Process data.docs from data.json
    const docs = data.docs
      .filter((item: any) => item.path.endsWith('.pdf')) // Ensure only PDFs are indexed as Zines
      .map((item: any) => ({ 
        name: item.name, 
        type: 'Zine' as MediaType, 
        path: item.path,
        cover: item.cover || PLACEHOLDER_COVER // Use provided cover or placeholder
      }))
    
    // Process data.livros from data.json
    const livros = data.livros.map((item: any) => ({ 
      name: item.name, 
      type: 'Livro' as MediaType, 
      path: item.path,
      cover: item.cover || PLACEHOLDER_COVER // Use provided cover or placeholder
    }))
    
    return [...docs, ...livros]
  }, [])

  const filteredMedia = useMemo(() => {
    return allMedia.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = activeFilter === 'Todos' || item.type === activeFilter
      return matchesSearch && matchesFilter
    })
  }, [search, activeFilter, allMedia])

  const zines = filteredMedia.filter(m => m.type === 'Zine')
  const livros = filteredMedia.filter(m => m.type === 'Livro')

  // Placeholder for "Nossos Amigos"
  const friends: FriendItem[] = [
    { name: "João Silva", url: "#", image: PLACEHOLDER_FRIEND_IMAGE },
    { name: "Maria Oliveira", url: "#", image: PLACEHOLDER_FRIEND_IMAGE },
    { name: "Pedro Souza", url: "#", image: PLACEHOLDER_FRIEND_IMAGE },
    { name: "Ana Costa", url: "#", image: PLACEHOLDER_FRIEND_IMAGE },
  ];

  const renderHome = () => (
    <>
      <div className="global-container">
        <div className="main-layout">
          {/* Sidebar - Nossos Amigos */}
          <aside className="sidebar">
            <h3>Nossos Amigos</h3>
            <ul>
              {friends.map((friend, i) => (
                <li key={i}>
                  <img src={friend.image} alt={friend.name} />
                  <a href={friend.url} target="_blank" rel="noopener noreferrer">{friend.name}</a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="main-content">
            {livros.length > 0 && (
              <section>
                <div className="section-header">
                  <h2>Biblioteca Digital</h2>
                  <span className="card-tag">{livros.length} itens</span>
                </div>
                <div className="grid">
                  {livros.map((livro, i) => (
                    <a key={i} href={livro.path} className="media-card" target="_blank" rel="noopener noreferrer">
                      <img src={livro.cover} alt={`Capa de ${livro.name}`} className="media-cover" />
                      <div className="media-info">
                        <span className="card-tag livro-tag">Livro</span>
                        <div className="media-title">{livro.name.replace('.pdf', '')}</div>
                        <div className="media-footer">
                          <span>PDF</span>
                          <span>•</span>
                          <span>Download disponível</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {zines.length > 0 && (
              <section>
                <div className="section-header">
                  <h2>Acervo de Zines</h2>
                  <span className="card-tag">{zines.length} itens</span>
                </div>
                <div className="grid">
                  {zines.map((zine, i) => (
                    <a key={i} href={zine.path} className="media-card" target="_blank" rel="noopener noreferrer">
                      <img src={zine.cover} alt={`Capa de ${zine.name}`} className="media-cover" />
                      <div className="media-info">
                        <span className="card-tag zine-tag">Zine</span>
                        <div className="media-title">{zine.name}</div>
                        <div className="media-footer">
                          <span>{zine.name.split('.').pop()?.toUpperCase()}</span>
                          <span>•</span>
                          <span>Arquivo Original</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {filteredMedia.length === 0 && (
              <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-light)' }}>
                <h3>Nenhum resultado para sua busca</h3>
                <p>Tente termos diferentes ou limpe os filtros.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  const renderBiography = () => (
    <div className="global-container">
      <div className="main-layout"> {/* Use main-layout for consistent padding/centering */}
        <div className="biography-section main-content"> {/* Apply main-content styles too */}
          <h2>Biografia de Leonardo Bruno Lange Tucunduva</h2>
          <p>
            Leonardo Bruno Lange Tucunduva é o criador do Contestado zine, um projeto independente que nasceu em 2002 a partir da necessidade de escrever e expressar ideias. Ao longo dos anos, sua escrita passou por transformações, evoluindo de textos iniciais mais experimentais para uma linguagem mais refinada e pessoal.
          </p>
          <p>
            O Contestado zine não segue uma linha fixa nem uma frequência rígida de publicação. Entre pausas e retornos, a escrita se mantém como um processo contínuo, marcado por reflexões, críticas e observações sobre diferentes temas.
          </p>
          <p>
            Mais do que um espaço de publicação, o zine é um registro dessa trajetória, reunindo textos que carregam questionamentos, inquietações e perspectivas próprias. A proposta é simples: compartilhar ideias e provocar reflexão.
          </p>
          <p>
            Para mais informações ou contato, você pode <a href="mailto:leobrulantu@gmail.com" style={{color: 'var(--accent)', textDecoration: 'none'}}>enviar um e-mail</a>.
          </p>
        </div>
        {/* Sidebar placeholder for biography page if needed */}
        <aside className="sidebar">
          <h3>Sobre o Autor</h3>
          <p>Leonardo é um entusiasta da história do Contestado e da escrita independente.</p>
          {/* Add more info or a relevant image */}
        </aside>
      </div>
    </div>
  )

  return (
    <div>
      <div className="header-top">
        <div className="global-container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="global-container">
          <div className="logo-container">
            <img src="/Contestado-Zine/logofoda.jpeg" alt={DEFAULT_LOGO_ALT} />
            <span className="tagline">Desde 2002 apontando o dedinho sujo na cara dos Hipócritas</span>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="nav-links">
          <span 
            className={`nav-item ${currentPage === 'home' && activeFilter === 'Todos' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('home'); setActiveFilter('Todos'); }}
          >
            INICIAL
          </span>
          <span 
            className={`nav-item ${currentPage === 'biography' ? 'active' : ''}`}
            onClick={() => setCurrentPage('biography')}
          >
            BIOGRAFIA
          </span>
          <span 
            className={`nav-item ${currentPage === 'home' && activeFilter === 'Zine' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('home'); setActiveFilter('Zine'); }}
          >
            CONTESTADO ZINE
          </span>
          <span 
            className={`nav-item ${currentPage === 'home' && activeFilter === 'Livro' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('home'); setActiveFilter('Livro'); }}
          >
            LIVROS
          </span>
          <span className="nav-item" onClick={() => alert('Contos em breve!')}>CONTOS</span>
          <span className="nav-item" onClick={() => alert('Incontestado em breve!')}>INCONTESTADO</span>
          <a href="mailto:leobrulantu@gmail.com" className="nav-item">CONTATO</a>
        </div>
      </nav>

      {currentPage === 'home' && (
        <div className="carousel-container">
          <div className="carousel-track">
            {phrases.map((phrase, index) => (
              <div 
                key={index} 
                className={`carousel-slide ${index === currentPhrase ? 'active' : ''}`}
              >
                <h2>{phrase}</h2>
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            {phrases.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentPhrase ? 'active' : ''}`}
                onClick={() => setCurrentPhrase(index)}
              ></span>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'home' ? renderHome() : renderBiography()}

      <footer>
        <div className="global-container">
          <img src="/Contestado-Zine/logofoda.jpeg" alt={DEFAULT_LOGO_ALT} style={{height: '50px', marginBottom: '1rem'}} />
          <p>&copy; {new Date().getFullYear()} Contestadozine. Todos os direitos reservados.</p>
          <p>
            <a href="#">Termos de Uso</a> | <a href="#">Política de Privacidade</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
