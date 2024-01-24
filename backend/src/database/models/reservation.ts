import {
    Sequelize,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Model,
    Association,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DateOnlyDataType,
} from 'sequelize';

import { Showing } from './showing';
import { User } from './user';

export class Reservation extends Model<
    InferAttributes<Reservation>,
    InferCreationAttributes<Reservation>
> {
    declare id: CreationOptional<number>;
    declare numSeats: number;
    declare showingId: number;
    declare userId: number;

    declare readonly createdAt: CreationOptional<DateOnlyDataType>;
    // declare readonly updatedAt: CreationOptional<Date>;

    declare getShowing: BelongsToGetAssociationMixin<Showing>;
    declare setShowing: BelongsToSetAssociationMixin<Showing, number>;

    declare getUser: BelongsToGetAssociationMixin<User>;
    declare setUser: BelongsToSetAssociationMixin<User, number>;

    public static associations: {
        showings: Association<Showing, Reservation>;
        users: Association<User, Reservation>;
    };
}

const initReservation = (sequelize: Sequelize): typeof Reservation => {
    Reservation.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            numSeats: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            showingId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Showings',
                    key: 'id',
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            createdAt: {
                type: DataTypes.DATEONLY,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: 'Reservations',
            modelName: 'Reservation',
            timestamps: false,
        }
    );

    return Reservation;
};

export default initReservation;
