import { useState, useMemo, useEffect } from 'react'
import data from './data.json'
import './index.css'
import logo from './assets/logofoda.jpeg'

type MediaType = 'Livro' | 'Zine'

interface MediaItem {
  name: string
  type: MediaType
  path: string
  cover?: string 
  synopsis?: string // Added synopsis field
}

interface FriendItem {
  name: string
  url: string
  image: string // Image URL for the friend
}

const PLACEHOLDER_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300' fill='%23e0e0e0'%3E%3Crect width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239e9e9e'%3ENo Cover%3C/text%3E%3C/svg%3E";
const DEFAULT_LOGO_ALT = "Logo Contestadozine"; // Alt text for the main logo

const getBookCoverStyle = (name: string) => {
  const colors = [
    '#4a148c', '#1a237e', '#01579b', '#004d40', '#1b5e20', 
    '#33691e', '#827717', '#f57f17', '#ff6f00', '#e65100', 
    '#bf360c', '#3e2723', '#212121', '#263238'
  ];
  const index = name.length % colors.length;
  return {
    backgroundColor: colors[index],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    textAlign: 'center' as const,
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    height: '180px',
    borderBottom: '4px solid rgba(0,0,0,0.2)',
    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)'
  };
};

function App() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<'Todos' | MediaType | 'Contos' | 'Incontestado'>('Todos')
  const [currentPage, setCurrentPage] = useState<'home' | 'biography'>('home')
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

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
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
      ? import.meta.env.BASE_URL 
      : `${import.meta.env.BASE_URL}/`;

    // Process data.docs from data.json
    const docs = data.docs
      .filter((item: any) => item.path.endsWith('.pdf')) // Ensure only PDFs are indexed as Zines
      .map((item: any) => ({ 
        name: item.name, 
        type: 'Zine' as MediaType, 
        path: `${baseUrl}${item.path.replace(/^\//, '')}`,
        cover: item.cover || PLACEHOLDER_COVER,
        synopsis: item.synopsis 
      }))
    
    // Process data.livros from data.json
    const livros = data.livros.map((item: any) => ({ 
      name: item.name, 
      type: 'Livro' as MediaType, 
      path: `${baseUrl}${item.path.replace(/^\//, '')}`,
      cover: item.cover || PLACEHOLDER_COVER,
      synopsis: item.synopsis 
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
  const friends: FriendItem[] = [];

  const renderHome = () => (
    <>
      <div className="global-container">
        <div className="main-layout">
          {/* Sidebar - Nossos Amigos */}
          <aside className="sidebar">
            {friends.length > 0 && (
              <>
                <h3>Nossos Amigos</h3>
                <ul>
                  {friends.map((friend, i) => (
                    <li key={i}>
                      <img src={friend.image} alt={friend.name} />
                      <a href={friend.url} target="_blank" rel="noopener noreferrer">{friend.name}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {friends.length === 0 && (
              <div style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                Espaço reservado para amigos e parceiros.
              </div>
            )}
          </aside>

          <div className="main-content">
            {livros.length > 0 && (
              <section>
                <div className="section-header">
                  <h2>Indicações de Leitura</h2>
                  <span className="card-tag">{livros.length} itens</span>
                </div>
                <div className="grid">
                  {livros.map((livro, i) => (
                    <div 
                      key={i} 
                      className="media-card" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedItem(livro)}
                    >
                      {livro.cover && livro.cover !== PLACEHOLDER_COVER ? (
                        <img src={livro.cover} alt={`Capa de ${livro.name}`} className="media-cover" />
                      ) : (
                        <div style={getBookCoverStyle(livro.name)}>
                          {livro.name.replace('.pdf', '')}
                        </div>
                      )}
                      <div className="media-info">
                        <span className="card-tag livro-tag">Livro</span>
                        <div className="media-title">{livro.name.replace('.pdf', '')}</div>
                        <div className="media-footer">
                          <span>PDF</span>
                          <span>•</span>
                          <span>Apenas divulgação</span>
                        </div>
                      </div>
                    </div>
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
                    <div 
                      key={i} 
                      className="media-card" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedItem(zine)}
                    >
                      {zine.cover && zine.cover !== PLACEHOLDER_COVER ? (
                        <img src={zine.cover} alt={`Capa de ${zine.name}`} className="media-cover" />
                      ) : (
                        <div style={{...getBookCoverStyle(zine.name), backgroundColor: '#333'}}>
                          {zine.name.replace('.pdf', '')}
                        </div>
                      )}
                      <div className="media-info">
                        <span className="card-tag zine-tag">Zine</span>
                        <div className="media-title">{zine.name}</div>
                        <div className="media-footer">
                          <span>{zine.name.split('.').pop()?.toUpperCase()}</span>
                          <span>•</span>
                          <span>Leitura Direta</span>
                        </div>
                      </div>
                    </div>
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
            <img src={logo} alt={DEFAULT_LOGO_ALT} />
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

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className={`modal-content ${selectedItem.type === 'Zine' ? 'modal-large' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>&times;</button>
            <div className="modal-body">
              {selectedItem.type === 'Zine' ? (
                <div className="pdf-viewer-container">
                  <iframe 
                    src={`${selectedItem.path}#toolbar=0&navpanes=0`} 
                    title={selectedItem.name}
                    width="100%" 
                    height="100%"
                    style={{ border: 'none' }}
                  />
                </div>
              ) : (
                <div className="modal-preview">
                  {selectedItem.cover && selectedItem.cover !== PLACEHOLDER_COVER ? (
                    <img src={selectedItem.cover} alt={selectedItem.name} />
                  ) : (
                    <div style={getBookCoverStyle(selectedItem.name)}>
                      {selectedItem.name.replace('.pdf', '')}
                    </div>
                  )}
                </div>
              )}
              
              <div className="modal-info-full">
                <span className="card-tag">{selectedItem.type}</span>
                <h2>{selectedItem.name.replace('.pdf', '')}</h2>
                <div className="synopsis">
                  <h3>{selectedItem.type === 'Zine' ? 'Informações' : 'Sinopse / Descrição'}</h3>
                  <p>{selectedItem.synopsis || (selectedItem.type === 'Zine' ? "Edição original do Contestado Zine disponível para leitura direta." : "Sinopse em breve. Este livro faz parte do nosso acervo de indicações de leitura para divulgação de conhecimento e cultura.")}</p>
                </div>
                {selectedItem.type === 'Zine' && (
                  <div style={{ marginTop: '1rem' }}>
                    <small style={{ color: 'var(--text-light)' }}>
                      Nota: Role o visualizador acima para ler o conteúdo completo.
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer>
        <div className="global-container">
          <img src={logo} alt={DEFAULT_LOGO_ALT} style={{height: '50px', marginBottom: '1rem'}} />
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
