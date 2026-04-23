import { create } from 'zustand';

export interface RoomInfo {
  name: string;
  userCount: number;
}

interface RoomState {
  currentRoom: string | null;
  roomList: RoomInfo[];
  
  setCurrentRoom: (room: string | null) => void;
  setRoomList: (rooms: RoomInfo[]) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  roomList: [],
  
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setRoomList: (rooms) => set({ roomList: rooms }),
}));
