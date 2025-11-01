import {
  Waveform
} from 'ldrs/react'

import 'ldrs/react/Waveform.css'
import '../../globals.css'

// Default values shown
export default function Loading( {
  message = "Cargando..."
}) {
  return (
    <div className="section">
      <div className="loading">
        <h2>{message}</h2>
        <div className="loader-container">
          <Waveform
            size="35"
            stroke="3.5"
            speed="1"
            color="var(--primary)"
            />
        </div>
      </div>
    </div>
  );
}