export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  icon: string | null;
};

export type Message = {
  id: string;
  userId: string;
  date: Date;
  roomId: string;
  read: boolean | null;
};

export type Room = {
  id: string;
  members: string[] | null;
  icon: string | null;
  description: string | null;
};
