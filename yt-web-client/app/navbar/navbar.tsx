import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/">
                <Image 
                    className={styles.logo} 
                    src="/youtube-logo.svg" 
                    alt="Youtube Logo"
                    width={90}
                    height={20}/>
            </Link>
        </nav>
    );
}