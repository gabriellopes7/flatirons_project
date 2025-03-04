import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  AppContainer, 
  AppHeader,
  AppTitle,
  TabButton,
  TabContainer,
  AppFooter,
  LogoContainer,
  Logo
} from './styles/AppComponents';
import logoImage from './assets/logo.jpg';
import FileUpload from './components/FileUpload';
import ProductList from './components/ProductList';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('list');

  return (
    <AppContainer>
      <AppHeader>
        <LogoContainer>
          <Logo src={logoImage} alt="Product Manager Logo" />
          <AppTitle>Product <span>Manager</span></AppTitle>
        </LogoContainer>
        <TabContainer>
          <TabButton 
            $active={activeTab === 'list'} 
            onClick={() => setActiveTab('list')}
          >
            List Products
          </TabButton>
          <TabButton 
            $active={activeTab === 'upload'} 
            onClick={() => setActiveTab('upload')}
          >
            Import Products
          </TabButton>
        </TabContainer>
      </AppHeader>
      {activeTab === 'upload' ? (
        <FileUpload />
      ) : (
        <ProductList />
      )}
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <AppFooter>
        © {new Date().getFullYear()} Product Manager - All rights reserved
      </AppFooter>
    </AppContainer>
  );
}

export default App;
