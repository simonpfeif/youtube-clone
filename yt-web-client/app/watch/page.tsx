'use client';

import { Suspense } from 'react';
import WatchVideo from "./WatchVideo"

export default function Watch() {
    return (
        <div>
            <h1>Watch Page</h1>
            <Suspense fallback={<div>Loading video...</div>}>
                <WatchVideo />
            </Suspense>
        </div>
    );
}