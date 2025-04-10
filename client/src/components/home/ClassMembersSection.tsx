import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface ClassMember {
  id: number;
  name: string;
  studentId: string;
  role: string;
  photoUrl: string;
}

const PhotoUploader = ({ member, onSuccess }: { member: ClassMember, onSuccess: () => void }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "File type not supported",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.length) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }
    
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('photo', file);
    
    setIsUploading(true);
    
    try {
      const response = await fetch(`/api/members/${member.id}/photo`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload photo');
      }
      
      toast({
        title: "Photo updated successfully",
        description: "Your photo has been updated",
        variant: "default"
      });
      
      onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the photo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-100 shadow-md mb-2">
          <img 
            src={preview || member.photoUrl} 
            alt={member.name} 
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="space-y-4 w-full">
          <div className="flex justify-center">
            <label className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-full transition-colors">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <i className="fas fa-image mr-2"></i>
              Select photo
            </label>
          </div>
          
          {preview && (
            <Button 
              className="w-full"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-2"></i>
                  Upload photo
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const MemberCard = ({ member }: { member: ClassMember }) => {
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const handleUploadSuccess = () => {
    // Refresh the members data
    queryClient.invalidateQueries({ queryKey: ['/api/members'] });
    setOpenPhotoDialog(false);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden member-card group hover:shadow-lg transition-all duration-300 border border-purple-50">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={member.photoUrl} 
          alt={`${member.name}`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Dialog open={openPhotoDialog} onOpenChange={setOpenPhotoDialog}>
            <DialogTrigger asChild>
              <button className="bg-white/90 text-purple-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 hover:bg-white">
                <i className="fas fa-camera"></i>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update profile photo</DialogTitle>
              </DialogHeader>
              <PhotoUploader member={member} onSuccess={handleUploadSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="p-4 relative">
        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600 member-name">{member.name}</h3>
        <p className="text-gray-600 member-nim flex items-center text-sm mt-1">
          <i className="fas fa-id-card text-purple-400 mr-2"></i>
          {member.studentId}
        </p>
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1/2 bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="fas fa-user-graduate text-xs"></i>
        </div>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Class Members</h2>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Class Members</h2>
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          Failed to load class members. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600 mb-8 flex items-center">
        <span className="mr-3">Class Members</span>
        <div className="h-1 flex-grow bg-gradient-to-r from-purple-400 to-indigo-400 rounded opacity-70"></div>
      </h2>
      
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search members..." 
            className="w-full sm:w-64 pl-12 pr-4 py-3 border border-purple-100 rounded-full focus:ring-2 focus:ring-purple-400 focus:border-purple-300 outline-none shadow-sm transition-all duration-300 focus:shadow-purple-300/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-purple-100 text-purple-700 w-7 h-7 rounded-full flex items-center justify-center">
            <i className="fas fa-search text-sm"></i>
          </div>
        </div>
        
        <div className="flex gap-3 bg-purple-50 p-1.5 rounded-full shadow-inner">
          <button 
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
              isGridView 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-purple-600 hover:bg-white/50'
            }`}
            onClick={() => setIsGridView(true)}
          >
            <i className="fas fa-th-large mr-2"></i>
            Grid
          </button>
          <button 
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
              !isGridView 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-purple-600 hover:bg-white/50'
            }`}
            onClick={() => setIsGridView(false)}
          >
            <i className="fas fa-list mr-2"></i>
            List
          </button>
        </div>
      </div>
      
      {isGridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {visibleMembers?.map((member, index) => (
            <div 
              key={member.id} 
              className="transform transition-all duration-500"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                transitionDelay: `${index * 0.03}s`
              }}
            >
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-purple-50">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-purple-100/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Student ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {visibleMembers?.map((member, index) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-purple-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-100 shadow-sm">
                        <img 
                          src={member.photoUrl} 
                          alt={member.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className="fas fa-id-card text-purple-400 mr-2 text-xs"></i>
                        <span className="text-sm text-gray-600">{member.studentId}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {!showAllMembers && allMembers.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button 
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 font-medium transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            onClick={() => setShowAllMembers(true)}
          >
            <i className="fas fa-users mr-2"></i>
            View All Members
          </button>
        </div>
      )}
    </section>
  );
};

export default ClassMembersSection;
