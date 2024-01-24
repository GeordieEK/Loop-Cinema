import {
    Sequelize,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Model,
    Association,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin,
} from 'sequelize';

import { Review } from './review';
import { Reservation } from './reservation';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>; // This will be automatically set by Sequelize
    declare name: string;
    declare email: string;
    declare password: string;
    declare is_restricted: boolean;
    declare is_admin: boolean;

    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;

    declare getReviews: HasManyGetAssociationsMixin<Review>;
    declare addReview: HasManyAddAssociationMixin<Review, number>;

    declare getReservations: HasManyGetAssociationsMixin<Reservation>;
    declare addReservation: HasManyAddAssociationMixin<Reservation, number>;

    public static associations: {
        reviews: Association<User, Review>;
        reservations: Association<User, Reservation>;
    };
}

const initUser = (sequelize: Sequelize): typeof User => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(1024),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(1024),
                allowNull: false,
            },
            is_restricted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
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
            tableName: 'Users',
            modelName: 'User',
            timestamps: true,
        }
    );

    console.log('initUser');
    return User;
};

export default initUser;
