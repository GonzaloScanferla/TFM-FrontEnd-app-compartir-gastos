export interface IUserGroups {
    group_id:    number;
    description: string;
    category:    string;
    creator_user: string;
    is_admin?:   boolean;
    totalexpenses?: number;
    balance?: number;
}
