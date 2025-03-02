"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Ensure Supabase is initialized here
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MemberRow } from "@/components/member-row";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  image: string;
  postsThisMonth: number;
  totalPosts: number;
}

export default function MemberRanking() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function fetchMembers() {
    const response = await fetch("/api/members");
    const result = await response.json();

    if (result.success) {
      setMembers(result.members);
    } else {
      alert("Error fetching members: " + result.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMembers();

    // Subscribe to real-time updates for the "members" table
    const subscription = supabase
      .channel("members") // Use a named channel for better management
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "members" },
        (payload) => {
          console.log("New member added:", payload.new);
          setMembers((prevMembers) => [...prevMembers, payload.new as Member]);

          toast("New Member Added", {
            description: `${payload.new.name} has joined the ranking.`,
          });
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setMembers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });

      toast("Ranking updated", {
        description: "Member positions have been reordered",
      });
    }
  };

  const handleUpdateMember = () => {
    fetchMembers();
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-white/50 dark:border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Group Activities</CardTitle>
          <CardDescription>
            "If you can't explain it to a six-year-old, you don't understand it
            yourself."
          </CardDescription>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="transition-all duration-300 hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-white/50 dark:border-slate-700/50 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-4 bg-slate-50/80 dark:bg-slate-800/80 font-medium text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Member</div>
            <div className="col-span-2 text-center">This Month</div>
            <div className="col-span-2 text-center">Total Posts</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={members.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y divide-white/20 dark:divide-slate-700/50 bg-white/50 dark:bg-slate-900/50 h-[200px] overflow-y-auto overflow-x-hidden scrollbar-thin">
                {members.map((member, index) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    index={index}
                    onUpdateMember={handleUpdateMember}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>

      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </Card>
  );
}
