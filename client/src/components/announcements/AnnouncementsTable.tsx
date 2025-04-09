import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface Announcement {
  id: number;
  date: string;
  title: string;
  description: string;
  category: string;
  postedBy: string;
}

const getCategoryBadgeColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'important':
      return 'bg-red-100 text-red-800';
    case 'assignment':
      return 'bg-blue-100 text-blue-800';
    case 'event':
      return 'bg-green-100 text-green-800';
    case 'lecture':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const AnnouncementsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const { data: announcements, isLoading, isError } = useQuery({
    queryKey: ['/api/announcements'],
  });

  const filteredAnnouncements = announcements?.filter((announcement: Announcement) => 
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.postedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = filteredAnnouncements 
    ? Math.ceil(filteredAnnouncements.length / itemsPerPage) 
    : 0;
  
  const paginatedAnnouncements = filteredAnnouncements
    ? filteredAnnouncements.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex mb-4 border-b">
          <button className="py-3 px-6 font-medium text-purple-700 border-b-2 border-purple-600">Announcements</button>
          <button className="py-3 px-6 font-medium text-gray-500 hover:text-purple-600">Schedule</button>
        </div>
        
        <div className="p-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !announcements) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex mb-4 border-b">
          <button className="py-3 px-6 font-medium text-purple-700 border-b-2 border-purple-600">Announcements</button>
          <button className="py-3 px-6 font-medium text-gray-500 hover:text-purple-600">Schedule</button>
        </div>
        
        <div className="p-4">
          <div className="bg-red-100 p-4 rounded-md text-red-800">
            Failed to load announcements. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex mb-4 border-b">
        <button className="py-3 px-6 font-medium text-purple-700 border-b-2 border-purple-600">Announcements</button>
        <button className="py-3 px-6 font-medium text-gray-500 hover:text-purple-600">Schedule</button>
      </div>
      
      <div className="overflow-x-auto p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date <i className="fas fa-sort ml-1"></i></TableHead>
              <TableHead>Title <i className="fas fa-sort ml-1"></i></TableHead>
              <TableHead>Category <i className="fas fa-sort ml-1"></i></TableHead>
              <TableHead>Posted By <i className="fas fa-sort ml-1"></i></TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAnnouncements.map((announcement: Announcement) => (
              <TableRow key={announcement.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {formatDate(announcement.date)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{announcement.title}</div>
                  <div className="text-gray-500 mt-1">{announcement.description}</div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(announcement.category)}`}>
                    {announcement.category}
                  </span>
                </TableCell>
                <TableCell>{announcement.postedBy}</TableCell>
                <TableCell className="text-right">
                  <button className="text-purple-600 hover:text-purple-900 mr-3">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <i className="fas fa-download"></i>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="px-4 py-3 flex items-center justify-between border-t">
        <div className="flex-1 flex justify-between sm:hidden">
          <button 
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button 
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredAnnouncements?.length || 0)}
              </span> of{' '}
              <span className="font-medium">{filteredAnnouncements?.length || 0}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === i + 1
                      ? 'bg-purple-50 text-purple-600 border-purple-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } text-sm font-medium`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsTable;
