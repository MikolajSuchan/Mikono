import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Sidebar.module.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transakcje", path: "/transactions" },
    { name: "Kategorie", path: "/categories" },
    { name: "Budżety", path: "/budgets" },
];

  return (
    <>
      {/* Hamburger */}
      <button className={styles.hamburger} onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* Overlay */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div className={styles.logo}>Mikono</div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} legacyBehavior>
              <a
                className={`${styles.navItem} ${
                  router.pathname === item.path ? styles.active : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
