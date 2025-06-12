import { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

// import './styles.css'; // Assicurati di avere questo file per gli stili, se necessario

// import required modules
import { EffectCube, Pagination } from 'swiper/modules';

function App() {
  const [repoLists, setRepoLists] = useState([]);
  const DEFAULT_IMAGE_URL = "https://placehold.co/600x400"; // La tua immagine di default

  // users repositories
  useEffect(() => {
    getData();
  }, []);

  const checkImageExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok; // true se lo status è 200-299, false altrimenti (es. 404)
    } catch (error) {
      console.error(`Errore nel controllo immagine per ${url}:`, error);
      return false; // In caso di errore di rete, assumiamo che l'immagine non sia disponibile
    }
  };

  const getData = async () => {
    try {
      const resp = await fetch(`https://api.github.com/users/MarcoMechini/repos`);
      const data = await resp.json();

      // Utilizziamo Promise.all per aspettare che tutte le verifiche delle immagini siano completate
      const finalDataPromises = data.map(async (e) => {
        const imageUrl = `https://raw.githubusercontent.com/MarcoMechini/${e.name}/main/public/Demo.png`;
        const imageExists = await checkImageExists(imageUrl);

        return {
          id: e.id,
          name: e.name,
          html_url: e.html_url,
          // Se l'immagine esiste, usa il suo URL, altrimenti usa l'immagine di default
          imageUrl: imageExists ? imageUrl : DEFAULT_IMAGE_URL,
        };
      });

      // Attendiamo che tutte le promise si risolvano
      const resolvedData = await Promise.all(finalDataPromises);

      console.log(resolvedData);
      setRepoLists(resolvedData);

    } catch (error) {
      console.error("Errore nel recupero dati GitHub:", error);
    }
  };

  return (
    <>

      <nav>
        <button>Home</button>
        <button>About Me</button>
        <button>Contact</button>
      </nav>

      <section className='section'>
        <Swiper
          effect={'cube'}
          grabCursor={true}
          cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          }}
          pagination={true}
          modules={[EffectCube, Pagination]}
          className="mySwiper"
        >
          {repoLists.length > 0 ? ( // Aggiunto un controllo per mostrare Swiper solo quando ci sono dati
            repoLists.map((e) => (
              <SwiperSlide className='slide' key={e.id}> {/* Aggiungi key per ottimizzazione React */}
                <div>{e.name}</div>
                <a href={e.html_url} target="_blank" rel="noopener noreferrer"> {/* Aggiunto target e rel per sicurezza */}

                  <img src={e.imageUrl} alt={`Immagine di ${e.name}`} /> {/* Usa imageUrl corretto */}
                </a>
              </SwiperSlide>
            ))
          ) : (
            <div>Caricamento repository...</div> // Messaggio di caricamento
          )}
        </Swiper>
      </section>
    </>
  );
}

export default App;