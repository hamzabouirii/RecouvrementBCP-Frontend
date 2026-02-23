import { HiOutlineBell } from 'react-icons/hi';

export default function Topbar({ title, highlight, userName = 'Admin', userRole = 'Super Admin' }) {
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <header className="topbar">
            <h1 className="topbar-title">
                {title} {highlight && <span>{highlight}</span>}
            </h1>

            <div className="topbar-right">
                <button className="topbar-notification">
                    <HiOutlineBell />
                    <div className="badge"></div>
                </button>

                <div className="topbar-user">
                    <div className="topbar-avatar">{initials}</div>
                    <div className="topbar-user-info">
                        <div className="topbar-user-name">{userName}</div>
                        <div className="topbar-user-role">{userRole}</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
