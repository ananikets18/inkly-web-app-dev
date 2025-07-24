"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MoreHorizontal, Edit2, Trash2, BookOpen, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import CreateCollectionModal from "./CreateCollectionModal"
import EditCollectionModal from "./EditCollectionModal"

interface Collection {
  id: string
  name: string
  description?: string
  coverColor?: string
  inkCount: number
  lastSavedInk?: {
    id: string
    content: string
    author: string
  }
  createdAt: string
  updatedAt: string
}

interface CollectionManagementProps {
  collections: Collection[]
  onCreateCollection: (collection: any) => void
  onUpdateCollection: (id: string, updates: any) => void
  onDeleteCollection: (id: string) => void
  onViewCollection: (id: string) => void
}

export default function CollectionManagement({
  collections,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  onViewCollection,
}: CollectionManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null)
  const { toast } = useToast()

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteCollection = async (collection: Collection) => {
    try {
      await onDeleteCollection(collection.id)
      toast({
        title: "Collection deleted",
        description: `"${collection.name}" has been removed.`,
      })
    } catch (error) {
      toast({
        title: "Failed to delete collection",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
    setDeletingCollection(null)
  }

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => onViewCollection(collection.id)}>
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${collection.coverColor || "from-gray-400 to-gray-500"} flex items-center justify-center flex-shrink-0`}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{collection.name}</h3>
                {collection.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{collection.description}</p>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingCollection(collection)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Collection
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeletingCollection(collection)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {collection.inkCount} ink{collection.inkCount !== 1 ? "s" : ""}
            </Badge>

            {collection.lastSavedInk && (
              <span className="text-xs text-muted-foreground">
                Updated {new Date(collection.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Collections</h2>
          <p className="text-muted-foreground">Organize your saved inks into collections</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Collection
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCollections.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No collections found" : "No collections yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Create your first collection to organize your saved inks"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Collection
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCollection={onCreateCollection}
      />

      {editingCollection && (
        <EditCollectionModal
          isOpen={!!editingCollection}
          onClose={() => setEditingCollection(null)}
          collection={editingCollection}
          onUpdateCollection={(updates) => {
            onUpdateCollection(editingCollection.id, updates)
            setEditingCollection(null)
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCollection} onOpenChange={() => setDeletingCollection(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCollection?.name}"? This action cannot be undone. The inks in
              this collection will not be deleted, but they will be removed from this collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCollection && handleDeleteCollection(deletingCollection)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Collection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
