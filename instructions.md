# In order to Enable the schedular use the below command
```sql
SHOW VARIABLES LIKE 'event_scheduler';
```
If the result shows event_scheduler set to OFF, you’ll need to turn it on.

```sql
SET GLOBAL event_scheduler = ON;

```


Alternatively, to enable it permanently, add the following line to your MySQL configuration file (my.cnf or my.ini):
```sql
[mysqld]
event_scheduler=ON
```


Step 4: Test the Event
If you want to test the event and see if it updates the status correctly:

Manually set a checkinDate or checkoutDate in the booking table to today or a past/future date.
Wait for the event to execute at the next scheduled interval (within the hour), or temporarily modify the interval to EVERY 5 MINUTE to see results sooner.