'use client';

import dynamic from 'next/dynamic';
import { MapPoint } from '@/actions/map';

// Dynamic import to avoid SSR issues with Leaflet
const WorldMapClient = dynamic(
    () => import('./WorldMapClient'),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[500px] w-full items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
                    <p className="text-sm text-zinc-500">Chargement de la carte...</p>
                </div>
            </div>
        )
    }
);

interface WorldMapProps {
    habitatPoints: MapPoint[];
    postPoints: MapPoint[];
}

export default function WorldMap({ habitatPoints, postPoints }: WorldMapProps) {
    return <WorldMapClient habitatPoints={habitatPoints} postPoints={postPoints} />;
}
