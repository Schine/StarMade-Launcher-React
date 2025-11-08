import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import News from './components/pages/News';
import Installations from './components/pages/Installations';
import Play from './components/pages/Play';
import Settings from './components/pages/Settings';
import LaunchConfirmModal from './components/common/LaunchConfirmModal';
import type { Page, PageProps } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Play');
  const [pageProps, setPageProps] = useState<PageProps>({});
  
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleNavigate = (page: Page, props: PageProps = {}) => {
    setActivePage(page);
    setPageProps(props);
  };

  const handleLaunchClick = () => {
    if (!isLaunching) {
      setIsLaunchModalOpen(true);
    }
  };
  
  const handleModalConfirm = () => {
      console.log("Terminate & Launch confirmed.");
      setIsLaunchModalOpen(false);
      setIsLaunching(true);
  };

  const handleLaunchAnyway = () => {
      console.log("Launch Anyway confirmed.");
      setIsLaunchModalOpen(false);
      setIsLaunching(true);
  };

  const handleModalCancel = () => {
      setIsLaunchModalOpen(false);
  };
  
  const handleLaunchComplete = () => {
      console.log("Launch sequence complete.");
      setIsLaunching(false);
  };

  const renderContent = () => {
    const props = { ...pageProps, onNavigate: handleNavigate };
    switch (activePage) {
      case 'Installations':
        return <Installations {...props} />;
      case 'News':
        return <News {...props} />;
      case 'Settings':
        return <Settings {...props} />;
      case 'Play':
      default:
        return <Play {...props} />;
    }
  };

  return (
    <div className="bg-starmade-bg text-gray-200 font-sans h-screen w-screen flex flex-col antialiased">
      <LaunchConfirmModal
        isOpen={isLaunchModalOpen}
        onConfirm={handleModalConfirm}
        onLaunchAnyway={handleLaunchAnyway}
        onCancel={handleModalCancel}
      />
      
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://www.star-made.org/images/bg1.jpg')" }}
      >
        <div 
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, black 100%)' }}
        ></div>
      </div>
      
      <div className="relative z-10 flex flex-col flex-grow h-full">
        <Header activePage={activePage} onNavigate={handleNavigate} />
        <main className="flex-grow flex items-center justify-center p-8 overflow-y-auto">
          {renderContent()}
        </main>
        <Footer 
          onNavigate={handleNavigate}
          isLaunching={isLaunching}
          onLaunchClick={handleLaunchClick}
          onLaunchComplete={handleLaunchComplete}
        />
      </div>
    </div>
  );
};

export default App;
