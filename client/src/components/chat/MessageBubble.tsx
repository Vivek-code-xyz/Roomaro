'use client';

import { AVATAR_ICONS } from '@/lib/avatars';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export function MessageBubble({ message }: { message: Message }) {
  const { username: currentUsername } = useUserStore();
  const isSelf = message.username === currentUsername;
  const isSystem = message.isSystem;
  
  const AvatarIcon = AVATAR_ICONS[message.avatar as keyof typeof AVATAR_ICONS] || AVATAR_ICONS.User;

  if (isSystem) {
    return (
      <div className="w-full flex justify-center my-6">
        <span className="px-4 py-1.5 rounded-full bg-muted/50 border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 backdrop-blur-sm">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 mb-3 items-end group max-w-[85%] sm:max-w-[70%]",
        isSelf ? "flex-row-reverse ml-auto" : "flex-row mr-auto"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center border transition-all saas-shadow",
        isSelf 
          ? "bg-primary border-primary text-white" 
          : "bg-card border-border text-muted-foreground"
      )}>
        <AvatarIcon size={16} />
      </div>

      <div className={cn(
        "flex flex-col gap-1",
        isSelf ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold text-muted-foreground/80 lowercase">
            @{message.username}
          </span>
          <span className="text-[9px] font-medium text-muted-foreground/40">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className={cn(
          "px-5 py-3 transition-all duration-300 saas-shadow",
          isSelf 
            ? "bg-primary text-white rounded-[1.5rem] rounded-tr-[0.25rem]" 
            : "bg-card border border-border text-foreground rounded-[1.5rem] rounded-tl-[0.25rem]"
        )}>
          <p className="text-sm md:text-base font-medium leading-relaxed tracking-tight whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </motion.div>
  );
}

