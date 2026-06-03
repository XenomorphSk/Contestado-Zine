import { useState, useMemo } from 'react'
import data from './data.json'
import './index.css'

type MediaType = 'Livro' | 'Zine'

interface MediaItem {
  name: string
  type: MediaType
  path: string
  cover?: string // Optional cover image path
}

interface Partner {
  name: string
  url: string
  image: string // Image URL for the partner
}

const PLACEHOLDER_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300' fill='%23e2e8f0'%3E%3Crect width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b'%3ENo Cover%3C/text%3E%3C/svg%3E";
const PLACEHOLDER_FRIEND_IMAGE = "https://via.placeholder.com/50?text=Friend"; // Generic placeholder for friend images

function App() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<'Todos' | MediaType>('Todos')
  const [currentPage, setCurrentPage] = useState<'home' | 'biography'>('home')

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

  // Placeholder partner data with images
  const partners: Partner[] = [
    { name: "João Silva", url: "#", image: PLACEHOLDER_FRIEND_IMAGE },
    { name: "Maria Oliveira", url: "#", image: PLACEHOLDER_FRIEND_IMAGE },
    { name: "Pedro Souza", url: "#", image: PLACEHOLDER_FRIEND_IMAGE },
    { name: "Ana Costa", url: "#", image: PLACEHOLDER_FRIEND_IMAGE },
  ];

  const renderHome = () => (
    <>
      <div className="hero">
        <h1>Explore o Acervo Contestadozine</h1>
        <p>Documentos históricos, zines e livros que contam histórias de resistência e cultura. Sua jornada de descoberta começa aqui.</p>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Buscar títulos, edições ou autores..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="main-layout">
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

        <aside className="sidebar">
          <h3>Nossos Amigos</h3> {/* Changed title to "Nossos Amigos" */}
          <ul>
            {partners.map((partner, i) => (
              <li key={i}>
                <img src={partner.image} alt={partner.name} />
                <a href={partner.url} target="_blank" rel="noopener noreferrer">{partner.name}</a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  )

  const renderBiography = () => (
    <div className="content">
      <div className="biography-section">
        <h2>Biografia e Missão</h2>
        <p>
          O Contestadozine é um projeto dedicado à preservação e disseminação da memória e cultura ligadas à Guerra do Contestado,
          um conflito histórico que marcou a região sul do Brasil no início do século XX. Nossa missão é oferecer acesso livre
          a documentos, zines e livros que exploram as múltiplas facetas desse evento, desde seus aspectos sociais e políticos
          até as narrativas populares e a resistência dos povos envolvidos.
        </p>
        <p>
          Acreditamos que a história é uma ferramenta poderosa para a compreensão do presente e a construção de um futuro mais justo.
          Por isso, nos esforçamos para reunir e digitalizar materiais que, de outra forma, poderiam ser esquecidos ou de difícil acesso.
          Este portal é um ponto de encontro para pesquisadores, estudantes e todos aqueles interessados em aprofundar seu conhecimento
          sobre a rica e complexa história do Contestado.
        </p>
        <p>
          Convidamos você a explorar nosso acervo, descobrir novas perspectivas e contribuir para manter viva a chama da história.
          Se tiver sugestões ou materiais para compartilhar, <a href="mailto:contato@contestadozine.com" style={{color: 'var(--accent)', textDecoration: 'none'}}>entre em contato</a> conosco.
        </p>
      </div>
    </div>
  )

  return (
    <div>
      <nav className="navbar">
        <a href="#" onClick={() => setCurrentPage('home')} className="nav-brand">
          <img src="logofoda.jpeg" alt="Contestadozine Logo" />
          {/* Título textual removido; a logo é o título */}
        </a>
        <div className="nav-links">
          {currentPage === 'home' && (
            <>
              <span 
                className={`nav-item ${activeFilter === 'Todos' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Todos')}
              >
                Todos
              </span>
              <span 
                className={`nav-item ${activeFilter === 'Livro' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Livro')}
              >
                Livros
              </span>
              <span 
                className={`nav-item ${activeFilter === 'Zine' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Zine')}
              >
                Zines
              </span>
            </>
          )}
          <span 
            className={`nav-item ${currentPage === 'biography' ? 'active' : ''}`}
            onClick={() => setCurrentPage('biography')}
          >
            Biografia
          </span>
          <a href="mailto:contato@contestadozine.com" className="nav-item button">
            Contato
          </a>
        </div>
      </nav>

      {currentPage === 'home' ? renderHome() : renderBiography()}

      <footer>
        <p><strong>Contestadozine Portal</strong></p>
        <p style={{ marginTop: '0.5rem' }}>Acesso livre à cultura e informação. {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
