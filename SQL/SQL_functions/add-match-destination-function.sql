-- This migration file adds the custom function to MySQL

DELIMITER $$

CREATE FUNCTION match_destination(
    prop_name VARCHAR(255), 
    prop_description TEXT, 
    prop_city VARCHAR(255), 
    prop_state VARCHAR(255), 
    prop_country VARCHAR(255), 
    destination VARCHAR(255)
) 
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    RETURN 
        LOWER(prop_name) LIKE CONCAT('%', LOWER(destination), '%') OR
        LOWER(prop_description) LIKE CONCAT('%', LOWER(destination), '%') OR
        LOWER(prop_city) LIKE CONCAT('%', LOWER(destination), '%') OR
        LOWER(prop_state) LIKE CONCAT('%', LOWER(destination), '%') OR
        LOWER(prop_country) LIKE CONCAT('%', LOWER(destination), '%');
END $$

DELIMITER ;
