import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/VideoCard";
import { UploadModal } from "@/components/UploadModal";
import { Upload, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/api-config";

interface Video {
  id: number;
  title: string;
  video_file?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  created_at: string;
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.videos);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      // Only show error toast on initial load
      if (loading) {
        toast({
          title: "Connection Error",
          description: "Cannot connect to backend. Check CORS settings.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    
    // Only poll if there are videos being processed
    const interval = setInterval(() => {
      if (videos.some(v => v.status === "PENDING" || v.status === "PROCESSING")) {
        fetchVideos();
      }
    }, 10000); // Poll every 10 seconds instead of 5

    return () => clearInterval(interval);
  }, [videos]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">StreamHub</h1>
          </div>
          <Button onClick={() => setUploadModalOpen(true)} className="bg-primary hover:bg-primary/90">
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <Video className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No videos yet</h2>
            <p className="text-muted-foreground mb-6">Upload your first video to get started</p>
            <Button onClick={() => setUploadModalOpen(true)} size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Videos</h2>
              <p className="text-muted-foreground">{videos.length} videos</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </>
        )}
      </main>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUploadSuccess={fetchVideos}
      />
    </div>
  );
};

export default Index;
