import {
    DataTypes,
    Model,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    Association,
    DateOnlyDataType,
} from 'sequelize';

import { User } from './user';
import { Movie } from './movie';

export class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare movieId: number;
    declare text: string;
    declare rating: number;
    declare softDeleted: CreationOptional<boolean>;

    declare getUser: BelongsToGetAssociationMixin<User>;
    declare setUser: BelongsToSetAssociationMixin<User, number>;

    declare getMovie: BelongsToGetAssociationMixin<Movie>;
    declare setMovie: BelongsToSetAssociationMixin<Movie, number>;

    declare readonly createdAt: CreationOptional<DateOnlyDataType>;
    declare readonly updatedAt: CreationOptional<DateOnlyDataType>;

    public static associations: {
        users: Association<User, Review>;
        movies: Association<Movie, Review>;
    };
}

const initReview = (sequelize: Sequelize): typeof Review => {
    Review.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            movieId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Movies',
                    key: 'id',
                },
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            softDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Review',
            timestamps: true,
        }
    );

    return Review;
};

export default initReview;
