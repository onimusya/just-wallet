import { useState } from 'react'
import { AppRoot, Cell, List, Section } from '@telegram-apps/telegram-ui';

import { CellSection } from '@/components/CellSection';
import { BannerSection } from '@/components/BannerSection';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

const cellsTexts = ['Chat Settings', 'Data and Storage', 'Devices'];

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <List>
        <CellSection />
        <BannerSection />
      </List>
    </>
  )
}

export default App
