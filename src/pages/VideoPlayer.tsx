import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: number;
  title: string;
  video_file: string;
  status: string;
  created_at: string;
}

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/videos/${id}/`);
        if (!response.ok) throw new Error("Failed to fetch video");
        const data = await response.json();
        setVideo(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load video",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Videos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden bg-card border-border">
              <video
                src={video.video_file}
                controls
                className="w-full aspect-video bg-black"
                autoPlay
              />
            </Card>

            <Card className="p-6 bg-card border-border">
              <h1 className="text-2xl font-bold text-foreground mb-4">{video.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(video.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold text-foreground mb-4">Related Videos</h3>
              <p className="text-sm text-muted-foreground">No related videos yet</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
