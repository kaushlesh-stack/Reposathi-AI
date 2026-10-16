import {
  BookOpen,
  FlaskConical,
  FolderTree,
  History,
  Layers,
  MessageSquareCode,
  Search,
  Settings,
} from "lucide-react";

export const WORKSPACE_PANELS = [
  { id: "overview", label: "Project overview", short: "Overview", icon: Layers },
  { id: "files", label: "File explorer", short: "Files", icon: FolderTree },
  { id: "search", label: "Search", short: "Search", icon: Search },
  { id: "explanations", label: "Code explanations", short: "Explanations", icon: BookOpen },
  { id: "tests", label: "Test results", short: "Tests", icon: FlaskConical },
  { id: "history", label: "Chat history", short: "History", icon: MessageSquareCode },
  { id: "settings", label: "Settings", short: "Settings", icon: Settings },
];