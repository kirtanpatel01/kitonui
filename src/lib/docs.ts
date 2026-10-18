/**
 * Re-export documentation accessors from the dedicated feature domain.
 * Preserves full backward-compatibility with existing import paths.
 */
export {
  hasDoc as hasComponentDoc,
  getDocSlugs as getComponentSlugs,
  getAllDocPreviews as getAllComponentDocs,
  getDocBySlug as getComponentDoc,
  getLazyDocBySlug as getLazyComponentDoc,
  findDocNeighbors,
} from "@/features/doc/data/documents"

export type {
  Doc,
  DocMetadata,
  DocModule,
  DocPreview,
  DocNeighbors,
} from "@/types/document"
