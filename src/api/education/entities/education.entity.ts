import { Profile } from "@src/api/profiles/entities/profile.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'Education'})
export class Education {
    @PrimaryGeneratedColumn('uuid', {
        comment: 'Id of education'
    })
    id: string;

    @Column({
        comment: "title of the education"
    })
    educationTitle: string

    @Column({
        comment: "starting date of the education"
    })
    startDate: Date

    @Column({
        comment: "ending date of the education"
    })
    endDate: Date

    @Column({
        comment: "description of the education",
        nullable: true,
        type: 'text',
    })
    description?: string

    @ManyToOne(()=> Profile, (profile: Profile)=> profile.educations)
    profile: Profile
}
