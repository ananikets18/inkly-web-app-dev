"use client"
import { motion } from "framer-motion"
import { Sparkles, MoreHorizontal, XCircle } from "lucide-react"
import ResponsiveInkCard from "@/components/ResponsiveInkCard"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useState } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Dialog } from "@/components/ui/dialog"

interface PinnedInksSectionProps {
  pinnedInks: any[]
  isOwnProfile: boolean
  onUnpinInk: (inkId: number) => void
  onSavePins?: (newPinIds: number[]) => void
  enableMobileScroll?: boolean
}

function SortableInkCard({ ink, children, id, editMode, handleCheckboxChange, checked }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: editMode ? "grab" : undefined,
      }}
      className="relative w-[280px] sm:w-[320px] flex-shrink-0"
      {...attributes}
      {...(editMode ? listeners : {})}
    >
      {editMode && (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => handleCheckboxChange(ink.id)}
            className="w-5 h-5 accent-purple-500 rounded shadow"
            style={{ background: 'white' }}
          />
          <span className="cursor-grab text-gray-400 text-lg ml-1 select-none">≡</span>
        </div>
      )}
      {children}
    </div>
  )
}

export default function PinnedInksSection({ pinnedInks, isOwnProfile, onUnpinInk, onSavePins, enableMobileScroll = false, unpinnedInks = [] }: PinnedInksSectionProps & { unpinnedInks?: any[] }) {
  const [editMode, setEditMode] = useState(false)
  const [editPins, setEditPins] = useState(pinnedInks.map(ink => ink.id))
  const [originalPins, setOriginalPins] = useState(pinnedInks.map(ink => ink.id))
  const MAX_PINS = 3
  const [addInkModalOpen, setAddInkModalOpen] = useState(false)

  // Handlers
  const handleToggleEditMode = () => {
    setEditMode((prev) => !prev)
    setEditPins(pinnedInks.map(ink => ink.id))
    setOriginalPins(pinnedInks.map(ink => ink.id))
  }
  const handleCheckboxChange = (inkId: number) => {
    setEditPins((prev) =>
      prev.includes(inkId) ? prev.filter(id => id !== inkId) : prev.length < MAX_PINS ? [...prev, inkId] : prev
    )
  }
  const handleUnpinAll = () => setEditPins([])
  const handleCancel = () => {
    setEditPins(originalPins)
    setEditMode(false)
  }
  const handleSave = () => {
    if (onSavePins) onSavePins(editPins)
    setOriginalPins(editPins)
    setEditMode(false)
    // Optionally show toast here
  }
  const handleAddInk = (inkId: number) => {
    if (editPins.length < MAX_PINS && !editPins.includes(inkId)) {
      setEditPins((prev) => [...prev, inkId])
      setAddInkModalOpen(false)
    }
  }

  if (!pinnedInks || pinnedInks.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-gray-800 shadow-xl mb-8 flex flex-col items-center justify-center min-h-[120px]">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">💫 Spotlight Inks</h2>
        {isOwnProfile && (
          <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-400 text-xs sm:text-sm" onClick={handleToggleEditMode}>
            Edit Pins
          </Button>
        )}
        <p className="text-gray-500 dark:text-gray-400 mt-4">Pin Inks to Spotlight for quick access</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-gray-800 shadow-xl mb-8"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">💫 Spotlight Inks</h2>
        </div>
        {isOwnProfile && !editMode && (
          <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-400 text-xs sm:text-sm" onClick={handleToggleEditMode}>
            Edit Pins
          </Button>
        )}
      </div>

      {enableMobileScroll ? (
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex flex-nowrap space-x-4 p-1">
            {pinnedInks.map((ink) => (
              <div key={ink.id} className="relative w-[280px] sm:w-[320px] flex-shrink-0">
                <ResponsiveInkCard
                  {...ink}
                  shareUrl={`https://inkly.app/ink/${ink.id}`}
                  onClick={() => {}}
                  onHover={() => {}}
                  onBookmark={() => {}}
                  onShare={() => {}}
                  onFollow={() => {}}
                  small
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
          {editMode ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={editMode ? (event) => {
                const { active, over } = event
                if (over && active.id !== over.id) {
                  setEditPins((items) => {
                    const oldIndex = items.indexOf(active.id)
                    const newIndex = items.indexOf(over.id)
                    return arrayMove(items, oldIndex, newIndex)
                  })
                }
              } : undefined}
            >
              <SortableContext items={editPins} strategy={horizontalListSortingStrategy}>
                <div className="flex w-max space-x-4 p-1">
                  {editPins.map((id) => {
                    const ink = pinnedInks.find((ink) => ink.id === id)
                    if (!ink) return null
                    return (
                      <SortableInkCard
                        key={ink.id}
                        id={ink.id}
                        ink={ink}
                        editMode={editMode}
                        handleCheckboxChange={handleCheckboxChange}
                        checked={editPins.includes(ink.id)}
                      >
                        <div className="relative">
                          <ResponsiveInkCard
                            {...ink}
                            shareUrl={`https://inkly.app/ink/${ink.id}`}
                            onClick={() => {}}
                            onHover={() => {}}
                            onBookmark={() => {}}
                            onShare={() => {}}
                            onFollow={() => {}}
                            small
                          />
                        </div>
                      </SortableInkCard>
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
          ) : null}
        </ScrollArea>
      )}
      {editMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg px-6 py-3 flex gap-4 items-center">
          <Button variant="default" size="sm" onClick={handleSave} disabled={editPins.length === 0 || editPins.length > MAX_PINS}>
            Save Changes
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="ghost" size="sm" onClick={handleUnpinAll}>
            Unpin All
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setAddInkModalOpen(true)} disabled={editPins.length >= MAX_PINS}>
            + Add Ink
          </Button>
          <span className="text-xs text-gray-500 ml-2">
            {editPins.length}/{MAX_PINS} pins
          </span>
          {editPins.length > MAX_PINS && (
            <span className="text-xs text-red-500 ml-2">You can pin up to {MAX_PINS} Inks</span>
          )}
          {addInkModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold mb-4">Add Ink to Spotlight</h3>
                {unpinnedInks.length === 0 ? (
                  <p className="text-gray-500">No more inks to pin.</p>
                ) : (
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {unpinnedInks.map((ink) => (
                      <li key={ink.id} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="truncate max-w-xs">{ink.content.slice(0, 40)}...</span>
                        <Button size="sm" onClick={() => handleAddInk(ink.id)} disabled={editPins.length >= MAX_PINS}>
                          Pin
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex justify-end mt-4">
                  <Button variant="ghost" size="sm" onClick={() => setAddInkModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
