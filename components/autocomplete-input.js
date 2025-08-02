"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, User, X } from "lucide-react"

export function AutocompleteInput({
  value,
  onChange,
  onSelect,
  onClear,
  searchFunction,
  placeholder = "Start typing to search...",
  displayField = "name",
  className = "",
  disabled = false,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [hasSelection, setHasSelection] = useState(false)

  const inputRef = useRef(null)
  const listRef = useRef(null)
  const debounceRef = useRef(null)

  // Debounced search function
  const debouncedSearch = async (query) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      if (query.trim().length >= 2 && !hasSelection) {
        setIsLoading(true)
        try {
          const results = await searchFunction(query)
          setSuggestions(results)
          setIsOpen(results.length > 0)
        } catch (error) {
          console.warn("Search failed:", error)
          setSuggestions([])
          setIsOpen(false)
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setIsOpen(false)
        setIsLoading(false)
      }
    }, 300)
  }

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)

    if (hasSelection) {
      setHasSelection(false)
      onClear?.()
    }

    debouncedSearch(newValue)
    setSelectedIndex(-1)
  }

  // Handle suggestion selection
  const handleSelect = (suggestion) => {
    onChange(suggestion[displayField])
    onSelect(suggestion)
    setHasSelection(true)
    setIsOpen(false)
    setSuggestions([])
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  // Handle clear selection
  const handleClear = () => {
    onChange("")
    onClear?.()
    setHasSelection(false)
    setIsOpen(false)
    setSuggestions([])
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        listRef.current &&
        !listRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 && !hasSelection) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          className={`${className} ${hasSelection ? "pr-20" : "pr-10"}`}
          disabled={disabled}
          autoComplete="off"
          {...props}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          {hasSelection && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <Card ref={listRef} className="absolute z-50 w-full mt-1 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id || index}
                  className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-muted/50 ${
                    index === selectedIndex ? "bg-muted" : ""
                  }`}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{suggestion[displayField]}</p>
                      {suggestion.phone && <p className="text-xs text-muted-foreground truncate">{suggestion.phone}</p>}
                      {suggestion.address && (
                        <p className="text-xs text-muted-foreground truncate">{suggestion.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
