DELIMITER //

CREATE TRIGGER UpdatePropertyMaxGuests
AFTER INSERT ON booking
FOR EACH ROW
BEGIN
    -- Update the maxGuests of the property associated with the booking
    IF NEW.propertyId IS NOT NULL THEN
        UPDATE property 
        SET CurrentSpace = CurrentSpace - (NEW.Adult + NEW.child)
        WHERE id = NEW.propertyId;
    END IF;
END //

DELIMITER ;
