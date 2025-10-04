import { Position, Tile } from "shared/types/tiles";

export enum DropTypes {
    TRAY,
    BOARD,
}

export enum DragTypes {
    TILE,
}

export interface DropData {
    dropType: DropTypes;
    priority: number;
}

export interface DropDataTray extends DropData {
    dropType: DropTypes.TRAY;
    dropIndex: number;
}

export interface DropDataBoard extends DropData {
    dropType: DropTypes.BOARD;
    rowNum: number;
    colNum: number;
}

export interface DragData {
    dragType: DragTypes;
}

export interface DragDataTile extends DragData {
    dragType: DragTypes.TILE;
    dragIndex: number | null; 
    tile: Tile;
}
