import Navbar from './Navbar';
import Footer from './Footer';
import PropTypes from 'prop-types';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="div-wrapper">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}

Layout.propTypes = { children: PropTypes.node.isRequired };

export default Layout;
