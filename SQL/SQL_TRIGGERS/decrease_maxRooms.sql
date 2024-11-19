DELIMITER //

CREATE TRIGGER UpdatePropertyMaxGuests
AFTER INSERT ON booking
FOR EACH ROW
BEGIN
    -- Update the maxGuests of the property associated with the booking
    IF NEW.propertyId IS NOT NULL AND NEW.isShared = 1 THEN
        UPDATE property 
        SET Current_space = Current_space - (NEW.Adult + NEW.Child)
        WHERE id = NEW.propertyId;
    END IF;
END //

DELIMITER ;
