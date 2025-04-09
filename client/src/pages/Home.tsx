import { useState } from "react";
import { useMembers } from "@/hooks/useMembers";
import { type Member } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import CoreMemberCard from "@/components/members/CoreMemberCard";
import MemberCard from "@/components/members/MemberCard";

const Home = () => {
  const { coreMembers, regularMembers, isLoading } = useMembers();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 8;
  
  // Filter members based on search query
  const filteredMembers = regularMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const currentMembers = filteredMembers.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  );

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 font-sans sm:text-4xl">Welcome to CryptGen Class Portal</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          A comprehensive platform for our class community to stay informed, connected, and organized throughout the academic year.
        </p>
      </div>

      {/* Banner Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern classroom" className="rounded-lg h-48 w-full object-cover" />
        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern classroom" className="rounded-lg h-48 w-full object-cover" />
        <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern classroom" className="rounded-lg h-48 w-full object-cover" />
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern classroom" className="rounded-lg h-48 w-full object-cover" />
      </div>

      {/* Class Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <h3 className="text-xl font-bold text-gray-900 font-sans mb-4">Class Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Class Name:</span> CryptGen</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Academic Year:</span> 2023/2024</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Number of Students:</span> 41</p>
          </div>
          <div>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Faculty:</span> Computer Science</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Program:</span> Undergraduate</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Semester:</span> Fall 2023</p>
          </div>
        </div>
      </div>

      {/* Core Members */}
      <h3 className="text-2xl font-bold text-gray-900 font-sans mb-6">Core Members</h3>
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[350px] bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {coreMembers.map(member => (
            <CoreMemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {/* Regular Members */}
      <h3 className="text-2xl font-bold text-gray-900 font-sans mb-6">Class Members</h3>
      
      {/* Search & Filter */}
      <div className="mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-10"
          />
          <Search className="absolute right-3 top-3 text-gray-400 h-4 w-4" />
        </div>
      </div>
      
      {/* Members Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-[250px] bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {currentMembers.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No members found matching your search criteria.</p>
            </div>
          ) : (
            currentMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))
          )}
        </div>
      )}
      
      {/* Pagination */}
      {filteredMembers.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex rounded-md shadow">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-l-md"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1">Previous</span>
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              // Logic to show current page and adjacent pages
              let pageNum = currentPage;
              if (i === 0 && currentPage > 1) pageNum = currentPage - 1;
              if (i === 2 && currentPage < totalPages) pageNum = currentPage + 1;
              if (totalPages <= 3) pageNum = i + 1;
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className="px-3 py-2 border-x-0"
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-r-md"
            >
              <span className="mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
