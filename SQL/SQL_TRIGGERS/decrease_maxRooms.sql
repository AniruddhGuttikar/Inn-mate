DELIMITER //

CREATE TRIGGER UpdatePropertyMaxGuests
AFTER INSERT ON booking as b
FOR EACH ROW
BEGIN
    -- Update the maxGuests of the property associated with the booking
    IF NEW.propertyId IS NOT NULL THEN
        UPDATE property 
        SET Current_space = Current_space - (NEW.Adult + NEW.child)
        WHERE id = NEW.propertyId AND b.isShared=1;
    END IF;
END //

DELIMITER ;
