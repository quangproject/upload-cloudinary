export type ResourceType = "image" | "video" | "raw";

export interface ValidationError {
  field: string;
  message: string;
}

export interface UploadReq {
  folder: string;
  resourceType: ResourceType;
}

export interface DeleteReq {
  publicId: string;
  resourceType: ResourceType;
}
