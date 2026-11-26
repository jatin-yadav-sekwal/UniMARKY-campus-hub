import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

// Tailwind preflight + the UniMARKY design system tokens.
import './index.css';
// Editorial primitives shared by pages migrated to the landing (v0) look.
import './styles/editorial.css';

import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)
