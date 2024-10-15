export default function generateTimeSlots(schedule, sessionTime) {
    const timeSlotsByDay = [];

    schedule.forEach(dayInfo => {
        const { day, openTime, closeTime, breakStart, breakFinish } = dayInfo;
        const timeSlots = [];
        
        // Convert time strings to minutes for easier manipulation
        const openMinutes = convertTimeToMinutes(openTime);
        const closeMinutes = convertTimeToMinutes(closeTime);
        const breakStartMinutes = breakStart ? convertTimeToMinutes(breakStart) : null;
        const breakFinishMinutes = breakFinish ? convertTimeToMinutes(breakFinish) : null;

        // Generate time slots
        let currentTime = openMinutes;

        while (currentTime < closeMinutes) {
            if (!(breakStartMinutes && currentTime >= breakStartMinutes && currentTime < breakFinishMinutes)) {
                const timeValue = convertMinutesToTime(currentTime);
                const displayTime = convertMinutesToDisplayTime(currentTime);
                timeSlots.push({ value: timeValue, display: displayTime });
            }

            currentTime += parseInt(sessionTime);

            // Prevent adding a slot that exceeds closing time
            if (currentTime > closeMinutes) {
                break;
            }
        }

        timeSlotsByDay.push({ day, timeSlots });
    });

    return timeSlotsByDay;
}

function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:00`;
}

function convertMinutesToDisplayTime(minutes) {
    let hours = Math.floor(minutes / 60);
    const mins = (minutes % 60).toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert hour '0' to '12'
    return `${hours}:${mins} ${period}`;
}
