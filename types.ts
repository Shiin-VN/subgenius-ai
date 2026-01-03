
export enum ToolMode {
  SUBTITLE = 'subtitle',
  VIDEO_GEN = 'video_gen',
  IMAGE_ANALYSIS = 'image_analysis'
}

export interface SubtitleChunk {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  message: string;
}
