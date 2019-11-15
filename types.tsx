import React, { useState } from 'react';
import TailSpin from './TailSpin';

export interface Scene {
    backgroundImage: string;
    items: any[];
    uniqueId: string;
    name: string;
}

export interface SceneItem {
    type: string;
    x: number;
    y: number;
    id: string;
    scale: number;
    rotation: number;
    zIndex: number;
    isLocked: boolean;
    flipped: boolean;
}

export function CartoonLoader(props) {
    return <div {...props}><TailSpin/></div>;
}

export function FullscreenCartoonLoader(props) {
    return <div className="hugeflex-center"><CartoonLoader {...props}/></div>;
}
export type DeltaType = number|'menu';

export interface TextSceneItem extends SceneItem {
    text: string;
}
export interface ImageSceneItem extends SceneItem {
    imageURL: string;
}

export function useForceUpdate(){
    const [value, setValue] = useState(true); //boolean state
    return () => setValue(!value); // toggle the state to force render
}

export function createStockTextItem(id: string, x = 0, y = 0): TextSceneItem { 
    return { type: 'text', text: "Hello world", id, x, y, scale: 1, rotation: 0, zIndex: 1000, isLocked: false, flipped: false };
}
export function createStockImageItem(imageURL: string, id: string, x = 0, y = 0): ImageSceneItem { 
    return { type: 'image', imageURL, id, x, y, scale: 1, rotation: 0, zIndex: 1000, isLocked: false, flipped: false };
}

export async function generateShortId(): Promise<string> {
    const shortid = await import("shortid");
    return shortid.generate();
}