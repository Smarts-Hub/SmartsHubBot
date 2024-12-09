
import Remembers from '../models/Remembers.js';

const loadActiveReminders = async (client) => {
    const activeReminders = await Remembers.find();
  
    activeReminders.forEach((reminder) => {
      scheduleReminder(reminder, client);
    });
  };

  const scheduleReminder = (reminder, client) => {
    const timeUntilReminder = reminder.remember - Date.now();
  
    if (timeUntilReminder > 0) {
      setTimeout(async () => {
        const user = await client.users.fetch(reminder.creatorId);
        if (user) {
          user.send(`⏰ Reminder: ${reminder.name}`);
        }
  
        // Remove the reminder from the database after triggering
        await Remembers.findByIdAndDelete(reminder._id);
      }, timeUntilReminder);
    }
  };  
  export default loadActiveReminders;
  