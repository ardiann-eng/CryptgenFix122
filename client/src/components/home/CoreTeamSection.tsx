import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface CoreTeamMember {
  id: number;
  name: string;
  studentId: string;
  role: string;
  photoUrl: string;
}

const CoreMemberCard = ({ member }: { member: CoreTeamMember }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 hover:shadow-xl transition-all duration-300 group">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={member.photoUrl} 
          alt={member.name} 
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-purple-100 text-sm mb-2">NIM: {member.studentId}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full text-sm font-medium shadow-sm">
            <i className={`fas ${
              member.role === "Class President" ? "fa-crown" : 
              member.role === "Secretary" ? "fa-file-alt" : 
              "fa-wallet"
            } mr-2`}></i>
            {member.role}
          </span>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
            <i className="fas fa-graduation-cap"></i>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600 mb-3">{member.name}</h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <i className="fas fa-id-card mr-2 text-purple-400"></i>
          <span>{member.studentId}</span>
        </p>
        <p className="text-gray-700 border-t border-purple-100 pt-4 text-sm">
          {member.role === "Class President" && "Responsible for overall class coordination and representing the class in official events."}
          {member.role === "Secretary" && "Handles class documentation, meeting notes, and communication management."}
          {member.role === "Treasurer" && "Manages class finances, tracks expenditures, and maintains financial transparency."}
        </p>
      </div>
    </div>
  );
};

const CoreTeamSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-5">
            <Skeleton className="h-6 w-24 mb-3" />
            <Skeleton className="h-7 w-48 mb-1" />
            <Skeleton className="h-5 w-36 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

const CoreTeamSection = () => {
  const { data: members, isLoading, isError } = useQuery({
    queryKey: ['/api/members'],
    select: (data: CoreTeamMember[]) => data.filter(member => 
      member.role === 'Class President' || 
      member.role === 'Secretary' || 
      member.role === 'Treasurer'
    )
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Core Team Members</h2>
        <CoreTeamSkeleton />
      </section>
    );
  }

  if (isError || !members) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Core Team Members</h2>
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          Failed to load core team members. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600 mb-8 flex items-center">
        <span className="mr-3 animate-pulse-subtle">Core Team Members</span>
        <div className="h-1 flex-grow bg-gradient-to-r from-purple-400 to-indigo-400 rounded opacity-70"></div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member, index) => (
          <div 
            key={member.id} 
            className="transform transition-all duration-300 hover:scale-105 hover:-rotate-1"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <CoreMemberCard member={member} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoreTeamSection;
