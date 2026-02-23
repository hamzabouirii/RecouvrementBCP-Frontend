import Sidebar from './Sidebar';
import Topbar from './Topbar';


export default function Layout({ children, activeItem, onNavigate, pageTitle, pageHighlight }) {
    return (
        <div className="app-layout">
            <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
            <div className="main-wrapper">
                <Topbar title={pageTitle} highlight={pageHighlight} />
                <main className="main-content">{children}</main>
            </div>
        </div>
    );
}
