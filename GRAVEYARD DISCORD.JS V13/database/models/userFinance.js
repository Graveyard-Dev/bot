module.exports = (sequelize, DataTypes) => {
    return sequelize.define("userFinance", {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};