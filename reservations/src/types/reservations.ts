export enum Status {
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELLED"
}

export interface Reservation {
  id: string,
  startTime: Date,
  endTime: Date,
  status: Status,
  roomId: string,
  room: { id: string; name: string };
  user: { id: string; name: string };
}