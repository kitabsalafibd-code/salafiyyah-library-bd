import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ermxrcaqkblsaespedvs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybXhyY2Fxa2Jsc2Flc3BlZHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDUwODIsImV4cCI6MjA4Nzc4MTA4Mn0.T7Lkro4B-ywZB4wujoHDgdzYg1hlNqTdCXsJXUUK0-E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
