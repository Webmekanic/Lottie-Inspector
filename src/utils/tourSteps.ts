import { TourStep } from '../types/tour';

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="app-container"]',
    title: '👋 Welcome to Lottie Inspector!',
    content: 'A powerful tool for inspecting, analyzing, and editing Lottie animations. Let\'s take a quick tour to get you started!',
    placement: 'center',
  },
  {
    id: 'upload',
    target: '[data-tour="upload-button"]',
    title: '📤 Upload Animations',
    content: 'Start by clicking here to upload a Lottie JSON file from your computer. You can inspect any Lottie animation!',
    placement: 'bottom',
  },
  {
    id: 'layers-panel',
    target: '[data-tour="left-panel"]',
    title: '📋 Layers Browser',
    content: 'This panel shows all layers in your animation. You can expand groups, toggle visibility, and select layers to inspect their properties.',
    placement: 'right',
  },
  {
    id: 'center-panel',
    target: '[data-tour="center-panel"]',
    title: '🎬 Animation Preview',
    content: 'Watch your animation play in real-time here. All changes you make will be reflected instantly in this preview area.',
    placement: 'left',
  },
  {
    id: 'properties-panel',
    target: '[data-tour="right-panel"]',
    title: '⚙️ Properties Inspector',
    content: 'Selected layer properties appear here. View and edit position, rotation, scale, opacity, colors, and more!',
    placement: 'left',
  },
  {
    id: 'ai-chat-tab',
    target: '[data-tour="ai-chat-tab"]',
    title: '🤖 AI Chat Assistant',
    content: 'NEW! Switch to this tab to edit animations using natural language. Just describe what you want, and AI will generate the changes!',
    placement: 'right',
  },
  {
    id: 'render-mode',
    target: '[data-tour="render-mode"]',
    title: '🎨 Render Mode',
    content: 'Toggle between SVG (crisp vectors) and Canvas (better performance for complex animations) rendering modes.',
    placement: 'bottom',
  },
  {
    id: 'complete',
    target: '[data-tour="app-container"]',
    title: '🎉 You\'re All Set!',
    content: 'You now know the basics of Lottie Inspector. Upload an animation and start exploring. Happy animating!',
    placement: 'center',
  },
];
