import { Member } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface MemberCardProps {
  member: Member;
}

const MemberCard = ({ member }: MemberCardProps) => {
  return (
    <Card className="overflow-hidden transform transition duration-300 hover:shadow-lg h-80">
      <div className="h-40 bg-secondary/20">
        {member.photoUrl && (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-bold text-gray-900 mb-1">{member.name}</h4>
        <p className="text-gray-600 text-sm mb-2">
          <span className="font-medium">NIM:</span> {member.nim}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Email:</span> {member.email}
        </p>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
