import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";
import logo from "../assets/logo.jpeg";
import "./Navbar.scss";

const cls = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuth, loading } = useAuth();

  const [openMobile, setOpenMobile] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const displayName =
    user?.username || user?.name || (user?.email ? user.email.split("@")[0] : "U");

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__left">
          <button className="navbar__burger" aria-label="Abrir menú" onClick={() => setOpenMobile((v) => !v)}>
            ☰
          </button>

          <Link to="/" className="navbar__brand" onClick={() => setOpenMobile(false)}>
            <img src={logo} alt="MP2" />
            <span>MP2</span>
          </Link>

          <nav className={cls("navbar__links", openMobile && "is-open")}>
            <NavLink to={isAuth ? "/home" : "/"} className="navlink" onClick={() => setOpenMobile(false)}>
              Home
            </NavLink>

            {!loading && !isAuth && (
              <>
                <NavLink to="/login" className="navlink" onClick={() => setOpenMobile(false)}>
                  Iniciar sesión
                </NavLink>
                <NavLink to="/signup" className="navlink" onClick={() => setOpenMobile(false)}>
                  Registro
                </NavLink>
              </>
            )}

            {!loading && isAuth && (
              <NavLink to="/profile" className="navlink" onClick={() => setOpenMobile(false)}>
                Perfil
              </NavLink>
            )}
          </nav>
        </div>

        <div className="navbar__right">
          {!loading && isAuth ? (
            <div className="profile" ref={profileRef}>
              <button
                className="profile__btn"
                onClick={() => setOpenProfile((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={openProfile}
                title={displayName}
              >
                <div className="avatar">{(displayName[0] || "U").toUpperCase()}</div>
                <span className="profile__name">{displayName}</span>
                <span className="chev">▾</span>
              </button>

              {openProfile && (
                <div className="profile__menu" role="menu">
                  <Link to="/profile" className="profile__item" onClick={() => setOpenProfile(false)}>
                    Ver perfil
                  </Link>
                  <button
                    className="profile__item profile__logout"
                    onClick={async () => {
                      setOpenProfile(false);
                      await logout();
                      navigate("/", { replace: true });
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: 12 }} />
          )}
        </div>
      </div>
    </header>
  );
}
