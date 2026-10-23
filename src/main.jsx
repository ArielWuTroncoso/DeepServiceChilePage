import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { IdiomaProvider } from './i18n/IdiomaContext';
import { SLUGS_LOCALES } from './i18n/datos';
import { cargarEstadoCatalogo } from './i18n/catalogoRemoto';

/* Tipografías autoalojadas: el sistema de diseño declara Inter y Barlow
   Condensed, así que se empaquetan con el sitio en vez de pedirlas a un
   servicio externo (funciona sin red de terceros y sin salto de fuente). */
import '@fontsource-variable/inter';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';

import './index.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/catalogo.css';
import './styles/forms.css';
import './styles/admin.css';

// Aplica al sitio lo que se decide en el panel (equipos dados de baja o nuevos). No bloquea nada.
cargarEstadoCatalogo(SLUGS_LOCALES);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <IdiomaProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </IdiomaProvider>
    </ThemeProvider>
  </StrictMode>,
);
