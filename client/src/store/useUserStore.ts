import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AvatarType, avatarList } from '../lib/avatars';
import { generateRandomUsername } from '../lib/utils';

export type ThemeType = 'light' | 'dark' | 'grey' | 'ocean' | 'sunset';
export type FontType = 'inter' | 'roboto' | 'outfit' | 'mono' | 'serif';

interface UserState {
  username: string;
  avatar: AvatarType;
  theme: ThemeType;
  font: FontType;
  avatarChanges: { count: number; date: string };
  recentRooms: string[];
  
  setUsername: (name: string) => void;
  setAvatar: (avatar: AvatarType) => { success: boolean; error?: string };
  setTheme: (theme: ThemeType) => void;
  setFont: (font: FontType) => void;
  addRecentRoom: (roomName: string) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: 'Analyst',
      avatar: 'User',
      theme: 'dark',
      font: 'inter',
      avatarChanges: { count: 0, date: '2026-04-07' },
      recentRooms: [],

      setUsername: (username) => set({ username }),
      
      setAvatar: (avatar) => {
        const today = new Date().toLocaleDateString();
        const currentChanges = get().avatarChanges;

        const isNewDay = currentChanges.date !== today;
        const newCount = isNewDay ? 0 : currentChanges.count;

        if (newCount >= 5) {
          return { success: false, error: 'Avatar change limit (5/day) exceeded' };
        }

        set({ 
          avatar, 
          avatarChanges: { count: newCount + 1, date: today } 
        });
        return { success: true };
      },

      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      
      addRecentRoom: (roomName) => {
        const current = get().recentRooms;
        // Keep unique, add to front, limit to 5
        const updated = [roomName, ...current.filter(r => r !== roomName)].slice(0, 5);
        set({ recentRooms: updated });
      },
      
      resetUser: () => set({
        username: generateRandomUsername(),
        avatar: avatarList[Math.floor(Math.random() * avatarList.length)],
        theme: 'dark',
        font: 'inter',
        avatarChanges: { count: 0, date: new Date().toLocaleDateString() },
        recentRooms: [],
      }),
    }),
    {
      name: 'roomora-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
