const sequelize = require("../config/db");

class AdminService {
    async findMostSicknessByAgeGroup() {
        try {
            const query = `
              WITH
    AgeGroups AS(
    SELECT
        s.name AS sickness_name,
        COUNT(DISTINCT u.id) AS number_of_people,
        CASE WHEN u.age BETWEEN 0 AND 9 THEN '0-9' WHEN u.age BETWEEN 10 AND 19 THEN '10-19' WHEN u.age BETWEEN 20 AND 29 THEN '20-29' WHEN u.age BETWEEN 30 AND 39 THEN '30-39' WHEN u.age BETWEEN 40 AND 49 THEN '40-49' WHEN u.age BETWEEN 50 AND 59 THEN '50-59' WHEN u.age BETWEEN 60 AND 69 THEN '60-69' WHEN u.age BETWEEN 70 AND 79 THEN '70-79' WHEN u.age BETWEEN 80 AND 89 THEN '80-89' WHEN u.age BETWEEN 90 AND 99 THEN '90-99'
END AS age_group
FROM
    prescriptions p
JOIN users u ON
    p.created_by = u.id
JOIN sicknesses s ON
    s.prescription_id = p.id
GROUP BY
    s.name,
    age_group
),
RankedAgeGroups AS(
    SELECT
        age_group,
        sickness_name,
        number_of_people,
        ROW_NUMBER() OVER(
        PARTITION BY age_group
    ORDER BY
        number_of_people
    DESC
    ) AS row_num
FROM
    AgeGroups)
    SELECT
        age_group,
        sickness_name,
        number_of_people
    FROM
        RankedAgeGroups
    WHERE
        row_num <= 3
    ORDER BY
        age_group,
        row_num;
            `;
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT
            });
            const groupedData = results.reduce((acc, item) => {
                let ageGroup = acc.find(group => group.age_group === item.age_group);
                if (!ageGroup) {
                    ageGroup = { age_group: item.age_group, sickness: [] };
                    acc.push(ageGroup);
                }
                ageGroup.sickness.push({ sickness_name: item.sickness_name, number_of_people: item.number_of_people });
                return acc;
            }, []);
            return groupedData;
        } catch (error) {
            const data = []
            return data;
        }
    }

    async findUserByAgeGroup() {
        try {
            const query = `
              SELECT
        CASE
            WHEN u.age BETWEEN 0 AND 9 THEN '0-9'
            WHEN u.age BETWEEN 10 AND 19 THEN '10-19'
            WHEN u.age BETWEEN 20 AND 29 THEN '20-29'
            WHEN u.age BETWEEN 30 AND 39 THEN '30-39'
            WHEN u.age BETWEEN 40 AND 49 THEN '40-49'
            WHEN u.age BETWEEN 50 AND 59 THEN '50-59'
            WHEN u.age BETWEEN 60 AND 69 THEN '60-69'
            WHEN u.age BETWEEN 70 AND 79 THEN '70-79'
            WHEN u.age BETWEEN 80 AND 89 THEN '80-89'
            WHEN u.age BETWEEN 90 AND 99 THEN '90-99'
        END AS age_group,
        COUNT(DISTINCT u.id) AS total_users
    FROM
        users u
    WHERE
        u.age BETWEEN 0 AND 99
    GROUP BY
        age_group
    ORDER BY
        age_group;
            `;
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT
            });
            return results;
        } catch (error) {
            const data = []
            return data;
        }
    }
    async getAverageVisitByAgeGroup() {
        try {
            const query = `
              SELECT CASE WHEN
    u.age BETWEEN 0 AND 9 THEN '0-9' WHEN u.age BETWEEN 10 AND 19 THEN '10-19' WHEN u.age BETWEEN 20 AND 29 THEN '20-29' WHEN u.age BETWEEN 30 AND 39 THEN '30-39' WHEN u.age BETWEEN 40 AND 49 THEN '40-49' WHEN u.age BETWEEN 50 AND 59 THEN '50-59' WHEN u.age BETWEEN 60 AND 69 THEN '60-69' WHEN u.age BETWEEN 70 AND 79 THEN '70-79' WHEN u.age BETWEEN 80 AND 89 THEN '80-89' WHEN u.age BETWEEN 90 AND 99 THEN '90-99'
END AS age_group,
AVG(COUNT(p.id)) OVER(
    PARTITION BY CASE WHEN u.age BETWEEN 0 AND 9 THEN '0-9' WHEN u.age BETWEEN 10 AND 19 THEN '10-19' WHEN u.age BETWEEN 20 AND 29 THEN '20-29' WHEN u.age BETWEEN 30 AND 39 THEN '30-39' WHEN u.age BETWEEN 40 AND 49 THEN '40-49' WHEN u.age BETWEEN 50 AND 59 THEN '50-59' WHEN u.age BETWEEN 60 AND 69 THEN '60-69' WHEN u.age BETWEEN 70 AND 79 THEN '70-79' WHEN u.age BETWEEN 80 AND 89 THEN '80-89' WHEN u.age BETWEEN 90 AND 99 THEN '90-99'
END
) AS average_visits
FROM
    prescriptions p
JOIN users u ON
    p.created_by = u.id
GROUP BY
    age_group
ORDER BY
    age_group;
            `;
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT
            });
            return results;
        } catch (error) {
            const data = []
            return data;
        }
    }
}


module.exports = new AdminService();

