import { Profile } from "@src/api/profiles/entities/profile.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Expertise {
    @PrimaryGeneratedColumn('uuid',{
        comment: "Id of the expertise",
    })
    id: string;

    @Column('text',{
        comment: "Domain of the expertise",
        array: true
    })
    domain: string[];

    @Column({
        comment: "Description of the expertise",
        type: 'text',
      
      
    })
    description?: string

    @ManyToOne(()=> Profile, (profile: Profile) => profile.expertise)
    profile: Profile
}
