'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Image from 'next/image';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

import { MapPoint } from '@/actions/map';

// Fix for default markers not showing in Next.js
const createCustomIcon = (type: 'habitat' | 'post') => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: ${type === 'habitat' ? 'linear-gradient(135deg, #10b981, #14b8a6)' : 'linear-gradient(135deg, #3b82f6, #0ea5e9)'};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 3px solid white;
                cursor: pointer;
                transition: transform 0.2s;
            ">
                ${type === 'habitat' ? '🦁' : '📷'}
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

interface WorldMapClientProps {
    habitatPoints: MapPoint[];
    postPoints: MapPoint[];
}

type MapMode = 'habitats' | 'explorer';

export default function WorldMapClient({ habitatPoints, postPoints }: WorldMapClientProps) {
    const [mode, setMode] = useState<MapMode>('habitats');

    const points = mode === 'habitats' ? habitatPoints : postPoints;

    const habitatIcon = createCustomIcon('habitat');
    const postIcon = createCustomIcon('post');

    return (
        <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl">
            {/* Mode Toggle */}
            <div className="absolute left-4 top-4 z-[1000]">
                <div className="flex rounded-xl bg-white/95 p-1 shadow-lg backdrop-blur-sm dark:bg-zinc-800/95">
                    <button
                        onClick={() => setMode('habitats')}
                        className={`
                            flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all
                            ${mode === 'habitats'
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'text-zinc-600 hover:text-emerald-600 dark:text-zinc-300'
                            }
                        `}
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Habitats
                        <span className={`rounded-full px-2 py-0.5 text-xs ${mode === 'habitats' ? 'bg-emerald-600/30' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                            {habitatPoints.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setMode('explorer')}
                        className={`
                            flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all
                            ${mode === 'explorer'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-zinc-600 hover:text-blue-600 dark:text-zinc-300'
                            }
                        `}
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Explorer
                        <span className={`rounded-full px-2 py-0.5 text-xs ${mode === 'explorer' ? 'bg-blue-600/30' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                            {postPoints.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Map */}
            <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                {/* Beautiful outdoor tiles - Stadia Outdoors */}
                <TileLayer
                    attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                    url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
                />

                {/* Markers */}
                {points.map((point) => (
                    <Marker
                        key={point.id}
                        position={[point.lat, point.lng]}
                        icon={point.type === 'habitat' ? habitatIcon : postIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="w-48">
                                {point.thumbnail && (
                                    <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg">
                                        <Image
                                            src={point.thumbnail}
                                            alt={point.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <h3 className="mb-1 font-semibold text-zinc-900 line-clamp-2 text-sm">
                                    {point.title}
                                </h3>
                                {point.animalId && (
                                    <Link
                                        href={`/animals/${point.animalId}`}
                                        className="text-sm text-emerald-600 hover:underline font-medium"
                                    >
                                        Voir l&apos;animal →
                                    </Link>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Empty State */}
            {points.length === 0 && (
                <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm">
                    <div className="text-center text-white">
                        <div className="mb-4 text-5xl">
                            {mode === 'habitats' ? '🌍' : '📷'}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">
                            {mode === 'habitats'
                                ? 'Aucun habitat renseigné'
                                : 'Aucune photo géolocalisée'
                            }
                        </h3>
                        <p className="text-sm text-zinc-300">
                            {mode === 'habitats'
                                ? 'Les habitats des animaux apparaîtront ici.'
                                : 'Les photos avec localisation apparaîtront ici.'
                            }
                        </p>
                    </div>
                </div>
            )}

            {/* Custom styles for markers */}
            <style jsx global>{`
                .custom-marker {
                    background: transparent !important;
                    border: none !important;
                }
                .custom-marker > div:hover {
                    transform: scale(1.15);
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    padding: 0;
                    overflow: hidden;
                }
                .leaflet-popup-content {
                    margin: 12px;
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }
                .leaflet-control-zoom a {
                    border-radius: 8px !important;
                    margin: 2px !important;
                }
            `}</style>
        </div>
    );
}
