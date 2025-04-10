import React, { useEffect, useState } from 'react';

interface ScheduleItem {
  day: string;
  time: string;
  course: string;
  room: string;
  color: string;
}

// Define props for the ClassSchedule component
interface ClassScheduleProps {
  onEditSchedule?: (item: ScheduleItem) => void;
}

// Create a grid structure with time slots and days
const createEmptyScheduleGrid = () => {
  // Default time slots (these can be overridden by added items)
  const defaultTimeSlots = ['08:00 - 10:00', '10:15 - 12:15', '13:00 - 15:00', '15:15 - 17:15'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  return defaultTimeSlots.map(time => {
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

const ClassSchedule = ({ onEditSchedule }: ClassScheduleProps) => {
  const [currentMonth, setCurrentMonth] = useState('April 2025');
  const [scheduleData, setScheduleData] = useState(emptyScheduleData);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  
  // Update the schedule grid with new item
  const updateScheduleGrid = (items: ScheduleItem[]) => {
    // Start with a clean grid
    let newGrid = createEmptyScheduleGrid();
    
    // Get all unique time slots from items
    const allTimeSlots = Array.from(new Set(items.map(item => item.time)));
    
    // If we have custom time slots not in the default grid, create a new grid with all time slots
    const customTimeSlots = allTimeSlots.filter(
      time => !newGrid.some(row => row.time === time)
    );
    
    if (customTimeSlots.length > 0) {
      // Create a set of unique time slots
      const defaultTimes = newGrid.map(row => row.time);
      const allTimes = [...defaultTimes, ...customTimeSlots];
      // Remove duplicates and sort
      const allUniqueTimeSlots = Array.from(new Set(allTimes)).sort(); // Sort times chronologically
      
      // Create a completely new grid with all time slots
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      newGrid = allUniqueTimeSlots.map(time => {
        const row: any = { time };
        days.forEach(day => {
          const lowerDay = day.toLowerCase();
          row[lowerDay] = { title: null, room: null, color: null };
        });
        return row;
      });
    }
    
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
      } else {
        // If we somehow don't have this time slot (should not happen), add a new row
        const newRow: any = { time };
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        days.forEach(d => {
          const lowerD = d.toLowerCase();
          newRow[lowerD] = { title: null, room: null, color: null };
        });
        newRow[dayLower] = { title: course, room: room, color: color };
        newGrid.push(newRow);
        
        // Sort the grid by time
        newGrid.sort((a, b) => a.time.localeCompare(b.time));
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
  
  // Function to update an existing schedule item
  (window as any).updateScheduleItem = (oldItem: ScheduleItem, newItem: ScheduleItem) => {
    // Find the item to update
    const updatedItems = scheduleItems.map(item => {
      // Match both day and time to identify the exact item
      if (item.day === oldItem.day && item.time === oldItem.time && item.course === oldItem.course) {
        return newItem; // Replace with new data
      }
      return item;
    });
    
    setScheduleItems(updatedItems);
    updateScheduleGrid(updatedItems);
    return true; // Indicate success
  };
  
  // Function to clear all schedule items
  const clearSchedule = () => {
    setScheduleItems([]);
    setScheduleData(createEmptyScheduleGrid());
  };
  
  // Function to find a schedule item by day and time for editing
  const findScheduleItem = (day: string, time: string, course: string): ScheduleItem | undefined => {
    return scheduleItems.find(item => 
      item.day === day && item.time === time && item.course === course
    );
  };
  
  // Handle clicking on a schedule item to edit it
  const handleEditClick = (day: string, time: string, course: string | null) => {
    if (!onEditSchedule || !course) return; // Don't trigger edit for empty slots or if no handler
    
    const item = findScheduleItem(day, time, course);
    if (item) {
      onEditSchedule(item);
    }
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
                  <div 
                    className={`p-2 rounded text-sm ${getColorClasses(row.monday.color)} ${row.monday.title ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={() => handleEditClick('Monday', row.time, row.monday.title)}
                  >
                    <div className="font-medium">
                      {row.monday.title || '-'}
                    </div>
                    {row.monday.room && (
                      <div className={`text-xs ${getDayColor(row.monday.color)}`}>
                        {row.monday.room}
                      </div>
                    )}
                    {row.monday.title && (
                      <div className="text-xs text-gray-500 mt-1">Click to edit</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div 
                    className={`p-2 rounded text-sm ${getColorClasses(row.tuesday.color)} ${row.tuesday.title ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={() => handleEditClick('Tuesday', row.time, row.tuesday.title)}
                  >
                    <div className="font-medium">
                      {row.tuesday.title || '-'}
                    </div>
                    {row.tuesday.room && (
                      <div className={`text-xs ${getDayColor(row.tuesday.color)}`}>
                        {row.tuesday.room}
                      </div>
                    )}
                    {row.tuesday.title && (
                      <div className="text-xs text-gray-500 mt-1">Click to edit</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div 
                    className={`p-2 rounded text-sm ${getColorClasses(row.wednesday.color)} ${row.wednesday.title ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={() => handleEditClick('Wednesday', row.time, row.wednesday.title)}
                  >
                    <div className="font-medium">
                      {row.wednesday.title || '-'}
                    </div>
                    {row.wednesday.room && (
                      <div className={`text-xs ${getDayColor(row.wednesday.color)}`}>
                        {row.wednesday.room}
                      </div>
                    )}
                    {row.wednesday.title && (
                      <div className="text-xs text-gray-500 mt-1">Click to edit</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div 
                    className={`p-2 rounded text-sm ${getColorClasses(row.thursday.color)} ${row.thursday.title ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={() => handleEditClick('Thursday', row.time, row.thursday.title)}
                  >
                    <div className="font-medium">
                      {row.thursday.title || '-'}
                    </div>
                    {row.thursday.room && (
                      <div className={`text-xs ${getDayColor(row.thursday.color)}`}>
                        {row.thursday.room}
                      </div>
                    )}
                    {row.thursday.title && (
                      <div className="text-xs text-gray-500 mt-1">Click to edit</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div 
                    className={`p-2 rounded text-sm ${getColorClasses(row.friday.color)} ${row.friday.title ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={() => handleEditClick('Friday', row.time, row.friday.title)}
                  >
                    <div className="font-medium">
                      {row.friday.title || '-'}
                    </div>
                    {row.friday.room && (
                      <div className={`text-xs ${getDayColor(row.friday.color)}`}>
                        {row.friday.room}
                      </div>
                    )}
                    {row.friday.title && (
                      <div className="text-xs text-gray-500 mt-1">Click to edit</div>
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
