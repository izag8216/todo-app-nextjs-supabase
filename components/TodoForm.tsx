import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type TodoFormProps = {
  onAdd: () => void
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const { error } = await supabase
      .from('todos')
      .insert({ title })
    
    if (error) console.log('Error adding todo:', error)
    else {
      setTitle('')
      onAdd()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new todo"
        className="flex-grow"
      />
      <Button type="submit">Add</Button>
    </form>
  )
}