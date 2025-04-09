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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={member.photoUrl} 
          alt={member.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
          {member.role}
        </span>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
        <p className="text-gray-600 mb-3">NIM: {member.studentId}</p>
        <p className="text-gray-700">
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Core Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member) => (
          <CoreMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
};

export default CoreTeamSection;
