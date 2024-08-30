'use client';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Trash2 } from 'lucide-react'

type Todo = {
  id: number
  title: string
  is_complete: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

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

  async function addTodo() {
    if (!newTodo.trim()) return
    const { error } = await supabase
      .from('todos')
      .insert({ title: newTodo })
    
    if (error) console.log('Error adding todo:', error)
    else {
      setNewTodo('')
      fetchTodos()
    }
  }

  async function toggleTodo(id: number, is_complete: boolean) {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !is_complete })
      .eq('id', id)
    
    if (error) console.log('Error updating todo:', error)
    else fetchTodos()
  }

  async function deleteTodo(id: number) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    
    if (error) console.log('Error deleting todo:', error)
    else fetchTodos()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">My Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter a new todo"
              className="flex-grow"
            />
            <Button onClick={addTodo}>
              <PlusCircle className="w-5 h-5 mr-1" />
              Add
            </Button>
          </div>
          <ul className="space-y-4">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={todo.is_complete}
                    onCheckedChange={() => toggleTodo(todo.id, todo.is_complete)}
                  />
                  <span className={`${todo.is_complete ? 'line-through text-gray-500' : ''}`}>
                    {todo.title}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}