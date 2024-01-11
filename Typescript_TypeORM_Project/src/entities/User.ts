import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { Post } from "./Post";

@Entity()
export class User extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Post, (post) => post.creator)
  @JoinColumn()
  posts: Post[];
}
