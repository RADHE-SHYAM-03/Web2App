import { useState } from 'react';
import './Components/Navbar.css';
import Navbar from './Components/Navbar.jsx';
import Herocontainer from './Components/Herocontainer.jsx';
import Description from './Components/Description.jsx';
import Feature from './Components/Feature.jsx';
import Footer from './Components/Footer.jsx';
import ResponsiveViewportHandler from './Components/ResponsiveViewportHandler.jsx';
import Developer from './Components/Developer.jsx';
function App() {
  return (
    <>
      <Herocontainer />
      <Description />
      <Feature />
      <Developer />
      <Footer />
    </>
  )
}
export default App
