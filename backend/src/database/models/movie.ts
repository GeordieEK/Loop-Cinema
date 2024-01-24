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

import { Showing } from './showing';
import { Review } from './review';

export class Movie extends Model<InferAttributes<Movie>, InferCreationAttributes<Movie>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare preview_img: string;
    declare preview_img_alt: string;
    // declare directors: string;
    // declare cast: string;
    declare description: string;
    // declare image: Blob;

    declare getShowings: HasManyGetAssociationsMixin<Showing>;
    declare addShowing: HasManyAddAssociationMixin<Showing, number>;

    declare getReviews: HasManyGetAssociationsMixin<Review>;
    declare addReview: HasManyAddAssociationMixin<Review, number>;

    public static associations: {
        showings: Association<Movie, Showing>;
        reviews: Association<Movie, Review>;
    };
}

const initMovie = (sequelize: Sequelize): typeof Movie => {
    Movie.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(256),
                allowNull: false,
            },
            preview_img: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            preview_img_alt: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            // directors: {
            //     type: DataTypes.STRING(256),
            //     allowNull: false,
            // },
            // cast: {
            //     type: DataTypes.STRING(256),
            //     allowNull: true,
            // },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            // image: {
            //     type: DataTypes.BLOB,
            //     allowNull: false,
            // },
        },
        {
            sequelize,
            tableName: 'Movies',
            modelName: 'Movie',
            timestamps: false,
        }
    );

    console.log('initMovie');
    return Movie;
};

export default initMovie;
