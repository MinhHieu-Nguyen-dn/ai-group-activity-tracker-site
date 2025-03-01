"use client"

import { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { MemberRow } from "@/components/member-row"
import { AddMemberDialog } from "@/components/add-member-dialog"

interface Member {
  id: string
  name: string
  image: string
  postsThisMonth: number
  totalPosts: number
}

export default function MemberRanking() {
  const [members, setMembers] = useState<Member[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    // Load members from localStorage or use default data
    const storedMembers = localStorage.getItem("members")
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers))
    } else {
      // Default members data
      setMembers([
        { id: "1", name: "John Doe", image: "/placeholder.svg", postsThisMonth: 5, totalPosts: 20 },
        { id: "2", name: "Jane Smith", image: "/placeholder.svg", postsThisMonth: 3, totalPosts: 15 },
      ])
    }
  }, [])

  useEffect(() => {
    // Save members to localStorage whenever it changes
    localStorage.setItem("members", JSON.stringify(members))
  }, [members])

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setMembers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })

      toast({
        title: "Ranking updated",
        description: "Member positions have been reordered",
      })
    }
  }

  const handleAddMember = (newMember: Omit<Member, "id">) => {
    const id = Date.now().toString()
    setMembers([...members, { ...newMember, id }])
    setIsAddDialogOpen(false)
    toast({
      title: "Member added",
      description: `${newMember.name} has been added to the ranking`,
    })
  }

  const handleUpdatePosts = (id: string, increment: boolean) => {
    setMembers(
      members.map((member) => {
        if (member.id === id) {
          const postsThisMonth = increment ? member.postsThisMonth + 1 : Math.max(0, member.postsThisMonth - 1)
          const totalPosts = increment ? member.totalPosts + 1 : Math.max(0, member.totalPosts - 1)
          return { ...member, postsThisMonth, totalPosts }
        }
        return member
      }),
    )
  }

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id))
    toast({
      title: "Member removed",
      description: "The member has been removed from the ranking",
    })
  }

  const handleEditMember = (id: string, data: Partial<Member>) => {
    setMembers(members.map((member) => (member.id === id ? { ...member, ...data } : member)))
    toast({
      title: "Member updated",
      description: "Member information has been updated",
    })
  }

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-white/50 dark:border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Group Activities</CardTitle>
          <CardDescription>
            "If you can't explain it to a six-year-old, you don't understand it yourself."
          </CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="transition-all duration-300 hover:scale-105">
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

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={members.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-white/20 dark:divide-slate-700/50 bg-white/50 dark:bg-slate-900/50">
                {members.map((member, index) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    index={index}
                    onUpdatePosts={handleUpdatePosts}
                    onDeleteMember={handleDeleteMember}
                    onEditMember={handleEditMember}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>

      <AddMemberDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddMember} />
    </Card>
  )
}

