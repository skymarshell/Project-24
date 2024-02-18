const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 20; hour++) { // Adjusted loop condition to stop at 19:30
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            timeSlots.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    // Add the last time slot manually
    timeSlots.push('20:00');
    return timeSlots;
};

export default function Timeline() {
    const timeSlots = generateTimeSlots();

    const generateCellIds = () => {
        const cellIds = [];
        daysOfWeek.forEach(day => {
            const dayCellIds = []; // Create an array for the current day
            timeSlots.forEach((time, index) => {
                dayCellIds.push(`${day}-${time}`); // Push cell IDs for the current day
            });
            cellIds.push(dayCellIds); // Push the array of cell IDs for the current day to the main array
        });
        return cellIds;
    };
    const cellIds = generateCellIds();

    const InsertTimeline = ({ coursetag, dayID, startHour, endHour }) => {
        const tdElement = document.createElement('td');

        const beforeTD = document.createElement('td');
        beforeTD.className = 'border px-4 py-2';
        beforeTD.colSpan = ((startHour - 8.00) * 2);

        // Set attributes for the td element
        tdElement.className = 'border px-4 py-2';
        tdElement.colSpan = ((endHour - startHour) * 2) + 1;

        // Set text content for the td element
        tdElement.textContent = coursetag;

        // Get the element with id 'Monday'
        const day = document.getElementById(dayID);

        if (day) {
            day.appendChild(beforeTD);
            day.appendChild(tdElement);
        }
    }

    return (
        <Container>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={() => InsertTimeline({ coursetag: '03603111', dayID: 'Monday', startHour: '9.00', endHour: '12.00' })}>
                Test Insert
            </button>

            <table className='bg-white'>
                <thead>
                    <tr>
                        <th className="border px-4 py-2"></th>
                        {timeSlots.map((time, timeIndex) => (
                            <th key={timeIndex} id={time} className='border px-4 py-2'>
                                {time}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {daysOfWeek.map((day, dayIndex) => (
                        <tr key={dayIndex} id={day}>
                            <td className='border px-4 py-2' colSpan={1}>{day}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </Container>
    );
};

const Container = ({ children }) => {
    return (
        <div className="overflow-x-auto overflow-y-hidden">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
                Test Overlapping
            </button>
            {children}
        </div>
    )
}