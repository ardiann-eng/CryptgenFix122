import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface CoreTeamMember {
  id: number;
  name: string;
  studentId: string;
  role: string;
  photoUrl: string;
}

const PhotoUploader = ({ member, onSuccess }: { member: CoreTeamMember, onSuccess: () => void }) => {
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
        title: "Format file tidak didukung",
        description: "Silakan pilih file gambar",
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
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih gambar untuk diunggah",
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
        throw new Error(errorData.message || 'Gagal mengunggah foto');
      }
      
      toast({
        title: "Foto berhasil diperbarui",
        description: "Foto profil Anda telah diperbarui",
        variant: "default"
      });
      
      onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Gagal mengunggah",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah foto",
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
              Pilih foto
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
                  Mengunggah...
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-2"></i>
                  Unggah foto
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const CoreMemberCard = ({ member }: { member: CoreTeamMember }) => {
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const handleUploadSuccess = () => {
    // Refresh the members data
    queryClient.invalidateQueries({ queryKey: ['/api/members'] });
    setOpenPhotoDialog(false);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 hover:shadow-xl transition-all duration-300 group">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={member.photoUrl} 
          alt={member.name} 
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
          <div className="p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-purple-100 text-sm mb-2">NIM: {member.studentId}</p>
              </div>
              <Dialog open={openPhotoDialog} onOpenChange={setOpenPhotoDialog}>
                <DialogTrigger asChild>
                  <button className="bg-white/90 text-purple-700 p-2 rounded-full transform hover:scale-110 hover:bg-white">
                    <i className="fas fa-camera"></i>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Perbarui foto profil</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Unggah foto profil baru untuk menampilkan di kartu anggota Anda.
                    </p>
                  </DialogHeader>
                  <PhotoUploader member={member} onSuccess={handleUploadSuccess} />
                </DialogContent>
              </Dialog>
            </div>
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
