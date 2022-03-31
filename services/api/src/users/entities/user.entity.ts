import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    displayName: string;

    @Column()
    twitchUserId: number;

    @Column({ type: 'json' })
    twitchAuthToken: {
        access_token: string,
        refresh_token: string,
        expires_in: number,
        scope: string[],
        token_type: string
    }

}
