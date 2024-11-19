DELIMITER //

CREATE PROCEDURE SearchProperties(
    IN p_destination VARCHAR(255),
    IN p_checkIn DATE,
    IN p_checkOut DATE,
    IN p_propertyType VARCHAR(50)
)
BEGIN
    SELECT 
        p.*, 
        l.availabilityStart, 
        l.availabilityEnd
    FROM 
        listing AS l
    JOIN 
        property AS p ON p.id = l.propertyId
    JOIN 
        location AS loc ON loc.id = p.locationId
    WHERE 
        1 = 1
        -- Destination filter using LIKE
        AND (p_destination IS NULL OR 
             CONCAT(p.name, ' ', p.description, ' ', loc.city, ' ', loc.state, ' ', loc.country) LIKE CONCAT('%', p_destination, '%'))
        -- Availability filter
        AND (p_checkIn IS NULL OR p_checkOut IS NULL OR 
             (l.availabilityStart <= p_checkIn AND l.availabilityEnd >= p_checkOut))
        -- Property type filter
        AND (p_propertyType IS NULL OR p.propertyType = p_propertyType);
END //

DELIMITER ;
