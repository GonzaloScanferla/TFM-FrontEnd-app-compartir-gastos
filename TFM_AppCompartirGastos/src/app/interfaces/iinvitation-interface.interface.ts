export interface IInvitationInterface {
  id: number;
  date: string;
  group_id: number;
  user_id: number;
  accepted: boolean;
  active: boolean;
}
