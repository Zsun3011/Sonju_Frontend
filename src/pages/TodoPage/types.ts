// src/pages/TodoPage/types.ts

export interface TodoItem {
  id: string;          // backend todo_num을 문자열로 사용
  title: string;       // task
  dueDate: Date;       // 날짜 + (옵션) 시간
  isAllDay: boolean;   // 하루종일 여부 (due_time 없으면 true)
  completed: boolean;  // is_completed
  completedDate?: Date;
}

export interface ApiTodo {
  owner_cognito_id: string;
  todo_num: number;
  task: string;
  is_completed: boolean;
  due_date: string;      // "2025-11-26" 같은 형식
  due_time?: string | null; // "10:22:45.735Z" or "10:22:45" 등
}

