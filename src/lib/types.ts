
import { Timestamp } from "firebase/firestore";

export interface Notification {
    id: string;
    title: string;
    description: string;
    createdAt: Timestamp;
    read: boolean;
    type: 'suggestion' | 'alert' | 'info';
}
