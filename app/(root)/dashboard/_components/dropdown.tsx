"use client";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";

export function DropdownMenuDemo() {
  const [curr, setCurr] = useState('Default');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{curr}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Services</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setCurr('Email')}>Email</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurr('SMS')}>SMS</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setCurr('Both')}>Both</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
