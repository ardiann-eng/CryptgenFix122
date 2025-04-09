import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface ClassMember {
  id: number;
  name: string;
  studentId: string;
  role: string;
  photoUrl: string;
}

const MemberCard = ({ member }: { member: ClassMember }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden member-card">
      <div className="h-40 overflow-hidden">
        <img 
          src={member.photoUrl} 
          alt={`${member.name}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 member-name">{member.name}</h3>
        <p className="text-gray-600 member-nim">NIM: {member.studentId}</p>
      </div>
    </div>
  );
};

const MembersSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Skeleton className="h-40 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

const ClassMembersSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [showAllMembers, setShowAllMembers] = useState(false);
  
  const { data: allMembers, isLoading, isError } = useQuery({
    queryKey: ['/api/members'],
    select: (data: ClassMember[]) => data.filter(member => 
      member.role === 'member'
    )
  });

  const filteredMembers = allMembers?.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.studentId.includes(searchTerm)
  );

  const visibleMembers = showAllMembers 
    ? filteredMembers 
    : filteredMembers?.slice(0, 6);

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Class Members</h2>
        <div className="mb-6 flex items-center justify-between">
          <div className="relative">
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <MembersSkeleton />
      </section>
    );
  }

  if (isError || !allMembers) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Class Members</h2>
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          Failed to load class members. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Class Members</h2>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search members..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium ${isGridView ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white'}`}
            onClick={() => setIsGridView(true)}
          >
            Grid View
          </button>
          <button 
            className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium ${!isGridView ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white'}`}
            onClick={() => setIsGridView(false)}
          >
            List View
          </button>
        </div>
      </div>
      
      {isGridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleMembers?.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleMembers?.map(member => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.studentId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!showAllMembers && allMembers.length > 6 && (
        <div className="mt-6 flex justify-center">
          <button 
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            onClick={() => setShowAllMembers(true)}
          >
            View All Members
          </button>
        </div>
      )}
    </section>
  );
};

export default ClassMembersSection;
