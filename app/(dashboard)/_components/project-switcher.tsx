"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Check, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "../contexts/ProjectContext";


interface Project {
  _id: string;
  orgId: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface ProjectSwitcherProps {
  orgId: string;
  isCollapsed: boolean;
}

export function ProjectSwitcher({ orgId, isCollapsed }: ProjectSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");

  // Use the context to store the selected project
  const { selectedProject, setSelectedProject } = useProject();

  // Fetch projects from Convex
  const projects: Project[] | undefined = useQuery(api.projects.getProjects, { orgId });

  const createProject = useMutation(api.projects.createProject);

  React.useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]._id);
    }
  }, [projects, selectedProject, setSelectedProject]);

  async function onCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      const newProj = await createProject({ orgId, name: newProjectName });
      setSelectedProject(newProj._id);
      setNewProjectName("");
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  }

  const currentProject = projects?.find((p: Project) => p._id === selectedProject);

  return (
    <>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new project to get started.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onCreateProject} className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create Project
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            size={isCollapsed ? "icon" : "default"}
            className={cn(!isCollapsed && "w-full flex items-center justify-start gap-2")}
          >
            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            {!isCollapsed && (
              <>
                {currentProject ? currentProject.name : "Select project..."}
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search projects..." className="h-9 focus-visible:ring-0 focus-visible:border-none" />
            <CommandList>
              <CommandEmpty>No projects found.</CommandEmpty>
              <CommandGroup>
                {projects?.map((project: Project) => (
                  <CommandItem
                    key={project._id}
                    value={project._id}
                    onSelect={(val) => {
                      // Update the selected project in the context
                      setSelectedProject(val === selectedProject ? "" : val);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    {project.name}
                    {selectedProject === project._id && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              <div className="p-2 pt-1">
                <Button size="sm" variant="outline" className="w-full" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default ProjectSwitcher;
