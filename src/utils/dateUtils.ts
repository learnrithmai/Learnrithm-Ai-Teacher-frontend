import { Chat, ChatsByDate } from "../types/chat";

export const getDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateStr = date.toDateString();
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();
  const tomorrowStr = tomorrow.toDateString();
  
  if (dateStr === todayStr) return "Today";
  if (dateStr === yesterdayStr) return "Yesterday";
  if (dateStr === tomorrowStr) return "Tomorrow";
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const groupChatsByDate = (chats: Chat[]): ChatsByDate => {
  const chatsByDate: ChatsByDate = {};
  
  chats.forEach(chat => {
    const dateLabel = getDateLabel(chat.timestamp);
    if (!chatsByDate[dateLabel]) {
      chatsByDate[dateLabel] = [];
    }
    if (!chatsByDate[dateLabel].some(c => c.id === chat.id)) {
      chatsByDate[dateLabel].push(chat);
    }
  });
  
  return chatsByDate;
};