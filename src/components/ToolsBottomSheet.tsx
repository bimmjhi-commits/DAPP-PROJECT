import React from 'react';

export interface ToolCategory {
  id: 'downloader' | 'canvas' | 'stalker' | 'maker';
  name: string;
  shortDesc: string;
  badge: string;
  icon?: React.ReactNode;
}

export const BOTTOM_SHEET_CATEGORIES: ToolCategory[] = [];

export interface ToolsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: any) => void;
  totalTools?: number;
}

export const ToolsBottomSheet: React.FC<ToolsBottomSheetProps> = () => {
  return null;
};

export default ToolsBottomSheet;
