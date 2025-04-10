import React, { useEffect, useState } from 'react';

interface ScheduleItem {
  day: string;
  time: string;
  course: string;
  room: string;
  color: string;
}

// Create a grid structure with time slots and days
const createEmptyScheduleGrid = () => {
  const timeSlots = ['08:00 - 10:00', '10:15 - 12:15', '13:00 - 15:00', '15:15 - 17:15'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  return timeSlots.map(time => {
    const row: any = { time };
    days.forEach(day => {
      const lowerDay = day.toLowerCase();
      row[lowerDay] = { title: null, room: null, color: null };
    });
    return row;
  });
};

// Initial empty schedule data
const emptyScheduleData = createEmptyScheduleGrid();

const getColorClasses = (color: string | null) => {
  if (!color) return 'bg-gray-100 text-gray-800';
  
  switch (color) {
    case 'purple':
      return 'bg-purple-100 text-purple-800';
    case 'blue':
      return 'bg-blue-100 text-blue-800';
    case 'green':
      return 'bg-green-100 text-green-800';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800';
    case 'pink':
      return 'bg-pink-100 text-pink-800';
    case 'orange':
      return 'bg-orange-100 text-orange-800';
    case 'indigo':
      return 'bg-indigo-100 text-indigo-800';
    case 'red':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getDayColor = (color: string | null) => {
  if (!color) return 'text-gray-600';
  
  switch (color) {
    case 'purple':
      return 'text-purple-600';
    case 'blue':
      return 'text-blue-600';
    case 'green':
      return 'text-green-600';
    case 'yellow':
      return 'text-yellow-600';
    case 'pink':
      return 'text-pink-600';
    case 'orange':
      return 'text-orange-600';
    case 'indigo':
      return 'text-indigo-600';
    case 'red':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const ClassSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState('April 2025');
  const [scheduleData, setScheduleData] = useState(emptyScheduleData);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  
  // Update the schedule grid with new item
  const updateScheduleGrid = (items: ScheduleItem[]) => {
    // Start with a clean grid
    const newGrid = createEmptyScheduleGrid();
    
    // Update grid cells with schedule items
    items.forEach(item => {
      const { day, time, course, room, color } = item;
      const dayLower = day.toLowerCase();
      
      // Find the row for this time slot
      const rowIndex = newGrid.findIndex(row => row.time === time);
      if (rowIndex >= 0) {
        // Update the cell with course info
        newGrid[rowIndex][dayLower] = { 
          title: course, 
          room: room, 
          color: color 
        };
      }
    });
    
    setScheduleData(newGrid);
  };
  
  // Effect to run when component mounts - load any saved schedule items
  useEffect(() => {
    // For demo, we'll create some example items
    const exampleItems: ScheduleItem[] = [
      {
        day: 'Monday',
        time: '08:00 - 10:00',
        course: 'Cryptography Basics',
        room: 'Room 301',
        color: 'purple'
      },
      {
        day: 'Tuesday',
        time: '08:00 - 10:00',
        course: 'Data Structures',
        room: 'Room 205',
        color: 'blue'
      },
      {
        day: 'Thursday',
        time: '08:00 - 10:00',
        course: 'Web Security',
        room: 'Room 102',
        color: 'green'
      }
    ];
    
    setScheduleItems(exampleItems);
    updateScheduleGrid(exampleItems);
    
    // In a real app, you would fetch from API here
    // const fetchSchedule = async () => {
    //   try {
    //     const response = await fetch('/api/schedule');
    //     const data = await response.json();
    //     setScheduleItems(data);
    //     updateScheduleGrid(data);
    //   } catch (error) {
    //     console.error('Error fetching schedule:', error);
    //   }
    // };
    // fetchSchedule();
  }, []);
  
  // Function to add a new schedule item - will be called from parent
  (window as any).addScheduleItem = (item: ScheduleItem) => {
    const newItems = [...scheduleItems, item];
    setScheduleItems(newItems);
    updateScheduleGrid(newItems);
    return true; // Indicate success
  };
  
  // Function to clear all schedule items
  const clearSchedule = () => {
    setScheduleItems([]);
    setScheduleData(createEmptyScheduleGrid());
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{currentMonth}</h3>
        </div>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-full hover:bg-red-700"
            onClick={clearSchedule}
          >
            <i className="fas fa-trash mr-2"></i> Clear Schedule
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monday
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tuesday
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wednesday
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thursday
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Friday
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scheduleData.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  {row.time}
                </td>
                <td className="px-4 py-4">
                  <div className={`p-2 rounded text-sm ${getColorClasses(row.monday.color)}`}>
                    <div className="font-medium">
                      {row.monday.title || '-'}
                    </div>
                    {row.monday.room && (
                      <div className={`text-xs ${getDayColor(row.monday.color)}`}>
                        {row.monday.room}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`p-2 rounded text-sm ${getColorClasses(row.tuesday.color)}`}>
                    <div className="font-medium">
                      {row.tuesday.title || '-'}
                    </div>
                    {row.tuesday.room && (
                      <div className={`text-xs ${getDayColor(row.tuesday.color)}`}>
                        {row.tuesday.room}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`p-2 rounded text-sm ${getColorClasses(row.wednesday.color)}`}>
                    <div className="font-medium">
                      {row.wednesday.title || '-'}
                    </div>
                    {row.wednesday.room && (
                      <div className={`text-xs ${getDayColor(row.wednesday.color)}`}>
                        {row.wednesday.room}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`p-2 rounded text-sm ${getColorClasses(row.thursday.color)}`}>
                    <div className="font-medium">
                      {row.thursday.title || '-'}
                    </div>
                    {row.thursday.room && (
                      <div className={`text-xs ${getDayColor(row.thursday.color)}`}>
                        {row.thursday.room}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`p-2 rounded text-sm ${getColorClasses(row.friday.color)}`}>
                    <div className="font-medium">
                      {row.friday.title || '-'}
                    </div>
                    {row.friday.room && (
                      <div className={`text-xs ${getDayColor(row.friday.color)}`}>
                        {row.friday.room}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSchedule;
