import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Users from './pages/components/Productitem'
import ContextButtonComponent from './pages/components/context-button/button'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2>
        <p>
          chgj;klkjhhhbjp[]
        </p>
       < Users />
      </h2>



      <ContextButtonComponent />
    </div>  )
}

export default App
