DELIMITER //

CREATE TRIGGER ResetPropertyStatusAfterBookingCompletion
AFTER UPDATE ON booking
FOR EACH ROW
BEGIN
    -- Check if the booking status is updated to 'COMPLETED'
    IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
        -- Update the associated property to reset Current_Space and isShared
        UPDATE property
        SET 
            Current_space = maxGuests,  -- Reset Current_Space to maxGuests
        WHERE id = NEW.propertyId;      -- Assuming `propertyId` links to the `property` table
    END IF;
END //

DELIMITER ;
