'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'A/lib/supabase-browser'
import {
  Users,
  Search,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  MessageSquare,
} from 'lucide-react