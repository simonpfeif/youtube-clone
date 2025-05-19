'use client'

import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import { SignIn } from "../signin/signin";
import { onAuthStateChangedHelper } from "@/app/utils/firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "../upload/upload";


export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user)
        })

        // cleanup when component is unmounted
        return () => unsubscribe()
    })

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
            {user && <Upload />}
            <SignIn user={ user }/>
        </nav>
    );
}