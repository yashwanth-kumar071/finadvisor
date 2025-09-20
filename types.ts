// Fix: Define the Message interface for chat messages.
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  sources?: { uri: string; title: string; }[];
}
