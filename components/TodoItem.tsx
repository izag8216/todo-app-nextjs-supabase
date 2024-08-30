import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Todo = {
  id: number
  title: string
  is_complete: boolean
}

type TodoItemProps = {
  todo: Todo
  onUpdate: () => void
  onDelete: () => void
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)

  async function handleToggleComplete() {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !todo.is_complete })
      .eq('id', todo.id)
    
    if (error) console.log('Error updating todo:', error)
    else onUpdate()
  }

  async function handleUpdate() {
    if (!editedTitle.trim()) return
    const { error } = await supabase
      .from('todos')
      .update({ title: editedTitle })
      .eq('id', todo.id)
    
    if (error) console.log('Error updating todo:', error)
    else {
      setIsEditing(false)
      onUpdate()
    }
  }

  async function handleDelete() {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id)
    
    if (error) console.log('Error deleting todo:', error)
    else onDelete()
  }

  return (
    <div className="flex items-center space-x-2 mb-2">
      <input
        type="checkbox"
        checked={todo.is_complete}
        onChange={handleToggleComplete}
        className="mr-2"
      />
      {isEditing ? (
        <Input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleUpdate}
          className="flex-grow"
        />
      ) : (
        <span className={`flex-grow ${todo.is_complete ? 'line-through' : ''}`}>
          {todo.title}
        </span>
      )}
      <Button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit'}
      </Button>
      <Button onClick={handleDelete} variant="destructive">Delete</Button>
    </div>
  )
}