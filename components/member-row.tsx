"use client"

import type React from "react"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, GripVertical, Upload, X, Check } from "lucide-react"

interface Member {
  id: string
  name: string
  image: string
  postsThisMonth: number
  totalPosts: number
}

interface MemberRowProps {
  member: Member
  index: number
  onUpdatePosts: (id: string, increment: boolean) => void
  onDeleteMember: (id: string) => void
  onEditMember: (id: string, data: Partial<Member>) => void
}

export function MemberRow({ member, index, onUpdatePosts, onDeleteMember, onEditMember }: MemberRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(member.name)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: member.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = () => {
    const updates: Partial<Member> = { name: editName }
    if (imagePreview) {
      updates.image = imagePreview
    }
    onEditMember(member.id, updates)
    setIsEditing(false)
    setImagePreview(null)
  }

  const handleCancelEdit = () => {
    setEditName(member.name)
    setIsEditing(false)
    setImagePreview(null)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
    >
      <div className="col-span-1 flex items-center">
        <span className="mr-2">{index + 1}</span>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <GripVertical size={16} />
        </button>
      </div>

      <div className="col-span-5 flex items-center space-x-3">
        {isEditing ? (
          <>
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700">
              <Image src={imagePreview || member.image} alt={member.name} fill className="object-cover" />
              <label
                htmlFor={`image-upload-${member.id}`}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload size={16} />
              </label>
              <input
                id={`image-upload-${member.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full max-w-[200px]" />
          </>
        ) : (
          <>
            <div
              className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
            </div>
            <span
              className="font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {member.name}
            </span>
          </>
        )}
      </div>

      <div className="col-span-2 text-center font-medium">{member.postsThisMonth}</div>

      <div className="col-span-2 text-center font-medium">{member.totalPosts}</div>

      <div className="col-span-2 flex justify-center space-x-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCancelEdit}
              className="h-8 w-8 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <X size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSaveEdit}
              className="h-8 w-8 transition-all duration-200 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
            >
              <Check size={16} />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdatePosts(member.id, false)}
              className="h-8 w-8 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <Minus size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdatePosts(member.id, true)}
              className="h-8 w-8 transition-all duration-200 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
            >
              <Plus size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDeleteMember(member.id)}
              className="h-8 w-8 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <X size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

