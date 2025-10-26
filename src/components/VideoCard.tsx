import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  id: number;
  title: string;
  video_file?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  created_at: string;
}

const statusConfig = {
  PENDING: { label: "Pending", variant: "secondary" as const, color: "text-muted-foreground" },
  PROCESSING: { label: "Processing", variant: "default" as const, color: "text-processing" },
  COMPLETED: { label: "Ready", variant: "default" as const, color: "text-success" },
  FAILED: { label: "Failed", variant: "destructive" as const, color: "text-destructive" },
};

export function VideoCard({ id, title, video_file, status, created_at }: VideoCardProps) {
  const navigate = useNavigate();
  const config = statusConfig[status];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (status === "COMPLETED") {
      navigate(`/video/${id}`);
    }
  };

  return (
    <Card
      className={`group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 ${
        status === "COMPLETED" ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={handleClick}
    >
      <div className="relative aspect-video bg-secondary overflow-hidden">
        {status === "COMPLETED" && video_file ? (
          <>
            <video
              src={video_file}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              preload="metadata"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Clock className="w-12 h-12 text-muted-foreground animate-pulse" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={config.variant} className="shadow-lg">
            {config.label}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{formatDate(created_at)}</p>
      </div>
    </Card>
  );
}
