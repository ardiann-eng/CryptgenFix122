import { Member } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";

interface CoreMemberCardProps {
  member: Member;
}

const CoreMemberCard = ({ member }: CoreMemberCardProps) => {
  // Format role for display (e.g., president -> Class President)
  const formatRole = (role: string) => {
    if (role === 'president') return 'Class President';
    if (role === 'secretary') return 'Secretary';
    if (role === 'treasurer') return 'Treasurer';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <Card className="overflow-hidden transform transition duration-300 hover:shadow-lg">
      <div className="h-48 bg-primary/20">
        {member.photoUrl && (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardContent className="p-5">
        <h4 className="font-bold text-lg text-gray-900 mb-1">{member.name}</h4>
        <p className="text-primary text-sm mb-3 font-semibold">{formatRole(member.role)}</p>
        <p className="text-gray-600 text-sm mb-2">
          <span className="font-medium">NIM:</span> {member.nim}
        </p>
        <p className="text-gray-600 text-sm mb-3">
          <span className="font-medium">Email:</span> {member.email}
        </p>
        <div className="flex space-x-2">
          <a href="#" className="text-primary hover:text-primary/80 text-sm">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href={`mailto:${member.email}`} className="text-primary hover:text-primary/80 text-sm">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoreMemberCard;
