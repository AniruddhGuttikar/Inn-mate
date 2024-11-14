DELIMITER //

CREATE PROCEDURE InsertCheckInCheckOutAndFetchBooking(
    IN p_bookingId VARCHAR(255),
    IN p_totalPrice DECIMAL(10, 2),
    IN p_userId VARCHAR(255),
    IN p_propertyId VARCHAR(255),
    IN p_status VARCHAR(50),
    IN p_checkInDate DATE,
    IN p_checkOutDate DATE,
    IN checkinoutID VARCHAR(225) , -- Corrected with comma
    IN Adult NUMBER,
    IN Child NUMBER
)
BEGIN
    DECLARE bookingExists BOOLEAN DEFAULT FALSE;

    -- Check if check-in/check-out data is provided (i.e., if dates are non-null)
    IF p_checkInDate IS NOT NULL AND p_checkOutDate IS NOT NULL THEN
        -- Insert check-in/check-out record
        INSERT INTO checkIncheckOut (id, checkInDate, checkOutDate, bookingId)
        VALUES (checkinoutID, p_checkInDate, p_checkOutDate, p_bookingId);
    END IF;

    -- Fetch and return the full booking data with checkInOut included
    SELECT b.*, c.checkInDate, c.checkOutDate
    FROM booking AS b
    LEFT JOIN checkIncheckOut AS c ON b.id = c.bookingId
    WHERE b.id = p_bookingId;
END //

DELIMITER ;
