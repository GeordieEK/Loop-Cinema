import {
    Sequelize,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Model,
} from 'sequelize';

import { Showing } from './showing'; // Import any associated models as needed

export class AvailableSeats extends Model<
    InferAttributes<AvailableSeats>,
    InferCreationAttributes<AvailableSeats>
> {
    declare showingId: CreationOptional<number>;
    declare availableCount: number;
}

const initAvailableSeats = (sequelize: Sequelize): typeof AvailableSeats => {
    AvailableSeats.init(
        {
            showingId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            availableCount: {
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            tableName: 'available_seats',
            modelName: 'AvailableSeats',
            timestamps: false,
        }
    );

    return AvailableSeats;
};

export default initAvailableSeats;