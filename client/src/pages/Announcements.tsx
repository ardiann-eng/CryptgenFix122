import { useState } from "react";
import { useAnnouncements, useEvents } from "@/hooks/useAnnouncements";
import { type Announcement, type Event } from "@shared/schema";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Clock, Building, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const Announcements = () => {
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();
  const { data: events, isLoading: eventsLoading } = useEvents();
  
  // Announcements state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 4;
  
  // Filter announcements based on search and category
  const filteredAnnouncements = announcements
    ? announcements.filter(announcement => 
        (searchQuery === "" || 
          announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (categoryFilter === "all" || announcement.category === categoryFilter)
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  
  // Calculate pagination for announcements
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
  const currentAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * announcementsPerPage,
    currentPage * announcementsPerPage
  );
  
  // Sort events by date (closest first)
  const upcomingEvents = events
    ? events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)
    : [];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 font-sans sm:text-4xl">Announcements & Schedule</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Stay up-to-date with important class information and upcoming events.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Announcements Section */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 font-sans">Announcements</h3>
                <Button>
                  New Announcement
                </Button>
              </div>
              
              {/* Search & Filter */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-grow">
                    <Input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchQuery}
                      onChange={e => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-3 text-gray-400 h-4 w-4" />
                  </div>
                  <Select
                    value={categoryFilter}
                    onValueChange={value => {
                      setCategoryFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Announcements Table */}
              {announcementsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posted By
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentAnnouncements.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No announcements found
                          </td>
                        </tr>
                      ) : (
                        currentAnnouncements.map((announcement) => (
                          <tr key={announcement.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(new Date(announcement.date), 'yyyy-MM-dd')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {announcement.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                announcement.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                                announcement.category === 'event' ? 'bg-green-100 text-green-800' :
                                announcement.category === 'deadline' ? 'bg-red-100 text-red-800' : 
                                announcement.category === 'financial' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {announcement.author}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button variant="ghost" size="sm" className="text-primary">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {filteredAnnouncements.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-medium">{(currentPage - 1) * announcementsPerPage + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * announcementsPerPage, filteredAnnouncements.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredAnnouncements.length}</span> announcements
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                      // Show the current page and adjacent pages
                      let pageNum = currentPage;
                      if (i === 0 && currentPage > 1) pageNum = currentPage - 1;
                      if (i === 2 && currentPage < totalPages) pageNum = currentPage + 1;
                      if (totalPages <= 3) pageNum = i + 1;
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Schedule Section */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 font-sans">Class Schedule</h3>
                <Button variant="link" className="text-primary p-0 h-auto">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>View Calendar</span>
                </Button>
              </div>
              
              {/* Upcoming Events */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-700">Upcoming Events</h4>
                
                {eventsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming events</p>
                ) : (
                  upcomingEvents.map(event => {
                    const eventDate = new Date(event.date);
                    const month = format(eventDate, 'MMM').toUpperCase();
                    const day = format(eventDate, 'd');
                    
                    return (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition">
                        <div className="flex items-start">
                          <div className="bg-primary/20 text-primary rounded-md p-2 text-center min-w-[60px] mr-4">
                            <span className="block text-xs">{month}</span>
                            <span className="block text-lg font-bold">{day}</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{event.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">
                              <Clock className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                              <span>{event.time}</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <Building className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                              <span>{event.location}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Weekly Schedule */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">Weekly Schedule</h4>
                <div className="space-y-3">
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <div className="w-20 font-medium text-gray-700">Monday</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Algorithm Analysis (09:00 - 11:00)</p>
                      <p className="text-xs text-gray-500">Dr. Wijaya - Room 201</p>
                    </div>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <div className="w-20 font-medium text-gray-700">Tuesday</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Database Systems (13:00 - 15:00)</p>
                      <p className="text-xs text-gray-500">Prof. Johnson - Lab 302</p>
                    </div>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <div className="w-20 font-medium text-gray-700">Wednesday</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">No Classes</p>
                    </div>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <div className="w-20 font-medium text-gray-700">Thursday</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Software Engineering (09:00 - 12:00)</p>
                      <p className="text-xs text-gray-500">Dr. Susanto - Room 105</p>
                    </div>
                  </div>
                  <div className="flex items-center py-2">
                    <div className="w-20 font-medium text-gray-700">Friday</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Cryptography (14:00 - 16:00)</p>
                      <p className="text-xs text-gray-500">Prof. Handoko - Lab 201</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
