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

import { User } from './user';

export class Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
    declare id: string;
    declare time: Date;
    declare userId: number | null;

    // declare createdAt: Date;
    // declare updatedAt: Date;

    declare getUser: BelongsToGetAssociationMixin<User>;
    declare setUser: BelongsToSetAssociationMixin<User, number>;

    public static associations: {
        user: Association<User, Token>;
    };
}

const initToken = (sequelize: Sequelize): typeof Token => {
    Token.init(
        {
            id: {
                type: DataTypes.STRING(256),
                primaryKey: true,
            },

            time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
        },

        {
            sequelize,
            tableName: 'Tokens',
            modelName: 'Token',
            timestamps: false,
        }
    );

    console.log('initToken');
    return Token;
};

export default initToken;
