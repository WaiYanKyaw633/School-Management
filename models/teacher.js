module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define('Teacher', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    });
  
    return Teacher;
  };
  