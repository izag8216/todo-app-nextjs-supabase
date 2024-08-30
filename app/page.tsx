'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from "@/components/ui/card"
import TodoForm from '@/components/TodoForm'
import TodoItem from '@/components/TodoItem'

type Todo = {
  id: number
  title: string
  is_complete: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.log('Error fetching todos:', error)
    else setTodos(data || [])
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">TODO List</h1>
        <TodoForm onAdd={fetchTodos} />
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onUpdate={fetchTodos}
            onDelete={fetchTodos}
          />
        ))}
      </Card>
    </main>
  )
}