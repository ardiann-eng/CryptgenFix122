import React from 'react';

const scheduleData = [
  {
    time: '08:00 - 10:00',
    monday: { title: 'Cryptography Basics', room: 'Room 301', color: 'purple' },
    tuesday: { title: 'Data Structures', room: 'Room 205', color: 'blue' },
    wednesday: { title: null, room: null, color: null },
    thursday: { title: 'Web Security', room: 'Room 102', color: 'green' },
    friday: { title: null, room: null, color: null },
  },
  {
    time: '10:15 - 12:15',
    monday: { title: null, room: null, color: null },
    tuesday: { title: 'Algorithms', room: 'Room 205', color: 'yellow' },
    wednesday: { title: 'Cryptography Lab', room: 'Room 301', color: 'purple' },
    thursday: { title: null, room: null, color: null },
    friday: { title: 'Ethics in Computing', room: 'Room 102', color: 'pink' },
  },
  {
    time: '13:00 - 15:00',
    monday: { title: 'Network Security', room: 'Room 301', color: 'orange' },
    tuesday: { title: null, room: null, color: null },
    wednesday: { title: 'Database Systems', room: 'Room 205', color: 'indigo' },
    thursday: { title: 'Advanced Cryptography', room: 'Room 301', color: 'red' },
    friday: { title: null, room: null, color: null },
  },
];

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
  const [currentMonth, setCurrentMonth] = React.useState('October 2023');
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{currentMonth}</h3>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <i className="fas fa-chevron-left text-gray-500"></i>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <i className="fas fa-chevron-right text-gray-500"></i>
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
