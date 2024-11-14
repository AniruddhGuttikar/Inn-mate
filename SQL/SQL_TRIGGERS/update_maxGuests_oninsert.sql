DELIMITER //

CREATE TRIGGER after_property_insert
AFTER INSERT ON property
FOR EACH ROW
BEGIN
    -- Update the 'Current_space' to match 'maxGuests' and set 'isShared' to 0 (false)
    UPDATE property
    SET Current_space = NEW.maxGuests,
        isShared = 0
    WHERE id = NEW.id;
END //

DELIMITER ;
