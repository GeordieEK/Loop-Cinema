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
} from 'sequelize';

import { Movie } from './movie';
import { Reservation } from './reservation';

export class Showing extends Model<InferAttributes<Showing>, InferCreationAttributes<Showing>> {
    declare id: CreationOptional<number>;
    declare movieId: number;
    declare time: string;

    declare getMovie: BelongsToGetAssociationMixin<Movie>;
    declare setMovie: BelongsToSetAssociationMixin<Movie, number>;

    public static associations: {
        movie: Association<Showing, Movie>;
        reservation: Association<Showing, Reservation>;
    };
}

const initShowing = (sequelize: Sequelize): typeof Showing => {
    Showing.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            movieId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            // TODO: This would be better as a date type
            time: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },

        {
            sequelize,
            tableName: 'Showings',
            modelName: 'Showing',
            timestamps: false,
        }
    );

    console.log('initShowing');
    return Showing;
};

export default initShowing;
