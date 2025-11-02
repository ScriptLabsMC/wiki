import {
  Bouncy
} from 'ldrs/react'

import 'ldrs/react/Bouncy.css'
import '../../globals.css'

// Default values shown
export default function Loading( {
  message = "Cargando..."
}) {
  return (
    <div className="section">
      <div className="loading">
        <h2 className="gradient-text">{message}</h2>
        <div className="loader-container">
          <Bouncy
            size="35"
            speed="1"
            color="var(--primary)"
            />
        </div>
      </div>
    </div>
  );
}