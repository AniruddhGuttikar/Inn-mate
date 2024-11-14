DELIMITER //

CREATE PROCEDURE get_active_bookings(IN propertyId INT)
BEGIN
    SELECT
        b.*,
        p.name, p.description, p.Pricepernight, p.maxGuests,
        p.propertytype, p.isHotel, p.isDeleted, p.RoomType,
        p.locationId,
        c.checkInDate, c.checkOutDate,
        b.totalPrice, b.userId
    FROM booking AS b
    JOIN property AS p ON b.propertyId = p.id
    JOIN checkIncheckOut AS c ON b.id = c.bookingId
    WHERE
        p.id = propertyId
        AND p.isDeleted = false
        AND b.status IN ('ACTIVE', 'CONFIRMED');
END //

DELIMITER ;
