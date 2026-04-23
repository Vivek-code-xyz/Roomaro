import { 
  User, Ghost, Cat, Dog, Rabbit, Bird, Mouse, Turtle, Fish, 
  Leaf, Flower, Sun, Moon, Cloud, Star, Heart, Smile, Zap, 
  Anchor, Bike, Car, Plane, Rocket, Music, Guitar, Mic, 
  Gamepad, Monitor, Smartphone, Camera, Book, Pen, Coffee, 
  Pizza, Apple, IceCream, Gift, Bell, Flag, Map, Compass, 
  Home, Lock, Shield, Eye, Flame, Droplet, Wind, Mountain
} from 'lucide-react';

export const AVATAR_ICONS = {
  User, Ghost, Cat, Dog, Rabbit, Bird, Mouse, Turtle, Fish, 
  Leaf, Flower, Sun, Moon, Cloud, Star, Heart, Smile, Zap, 
  Anchor, Bike, Car, Plane, Rocket, Music, Guitar, Mic, 
  Gamepad, Monitor, Smartphone, Camera, Book, Pen, Coffee, 
  Pizza, Apple, IceCream, Gift, Bell, Flag, Map, Compass, 
  Home, Lock, Shield, Eye, Flame, Droplet, Wind, Mountain
} as const;

export type AvatarType = keyof typeof AVATAR_ICONS;

export const avatarList: AvatarType[] = Object.keys(AVATAR_ICONS) as AvatarType[];
