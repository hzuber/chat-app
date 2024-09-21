export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  icon: string | null;
};

export type CreateUser = {
  username: string;
  email: string;
  password: string;
  icon: string | null;
};

export type Message = {
  id: string;
  userId: string;
  date: Date;
  chatId: string;
  read: boolean | null;
  message: string;
  user: User | null;
};

// export type MessageWithUser = {
//   message: Message;
//   user: User;
// };

export type Chat = {
  id: string;
  members: string[] | null;
  icon: string | null;
  description: string | null;
  title: string | null;
  type: "group" | "private";
  lastRead: Message | null;
  messages: Message[] | null;
};

export type UserResponse = {
  user: User;
  status: number;
  token: string;
};
