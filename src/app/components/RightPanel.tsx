import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { LottieLayer } from '../../types/lottie';
import { useEffect, useState } from 'react';

interface RightPanelProps {
  selectedLayer: LottieLayer | null;
  selectedLayerIndex: number | null;
  onPropertyChange: (layerIndex: number, property: string, value: any) => void;
}

export function RightPanel({ 
  selectedLayer, 
  selectedLayerIndex, 
  onPropertyChange 
}: RightPanelProps) {
  const [localValues, setLocalValues] = useState<any>({});

  // Sync local values when layer changes
  useEffect(() => {
    if (selectedLayer) {
      setLocalValues({
        posX: getValueFromKeyframe(selectedLayer.ks.p, 0) || 0,
        posY: getValueFromKeyframe(selectedLayer.ks.p, 1) || 0,
        scaleX: getValueFromKeyframe(selectedLayer.ks.s, 0) || 100,
        scaleY: getValueFromKeyframe(selectedLayer.ks.s, 1) || 100,
        rotation: getValueFromKeyframe(selectedLayer.ks.r) || 0,
        opacity: getValueFromKeyframe(selectedLayer.ks.o) ||100,
      });
    }
  }, [selectedLayer]);

  if (!selectedLayer || selectedLayerIndex === null) {
    return (
      <div className="w-[320px] bg-gray-900 border-l border-gray-800 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Select a layer to edit properties</p>
      </div>
    );
  }

  // Helper to get value from keyframe property
  function getValueFromKeyframe(prop: any, index?: number): number {
    if (!prop) return index !== undefined ? 0 : 0;
    
    if (prop.a === 0) {
      // Static value
      if (Array.isArray(prop.k)) {
        return index !== undefined ? prop.k[index] : prop.k[0];
      }
      return prop.k;
    } else {
      // Animated - get first keyframe
      if (Array.isArray(prop.k) && prop.k.length > 0) {
        const firstFrame = prop.k[0];
        if (firstFrame.s) {
          return index !== undefined ? firstFrame.s[index] : firstFrame.s[0];
        }
      }
    }
    return 0;
  }

  // Helper to update property value
  const updateProperty = (property: string, value: number, index?: number) => {
    setLocalValues((prev: any) => ({ ...prev, [property]: value }));
    
    // Update in state machine
    if (selectedLayerIndex !== null) {
      const prop = property.startsWith('pos') ? 'ks.p' :
                   property.startsWith('scale') ? 'ks.s' :
                   property === 'rotation' ? 'ks.r' :
                   property === 'opacity' ? 'ks.o' : '';
      
      if (prop) {
        const currentProp = property.startsWith('pos') ? selectedLayer.ks.p :
                           property.startsWith('scale') ? selectedLayer.ks.s :
                           property === 'rotation' ? selectedLayer.ks.r :
                           selectedLayer.ks.o;
        
        let newValue;
        if (index !== undefined) {
          // Array value (position, scale)
          const current = Array.isArray(currentProp.k) ? [...currentProp.k] : [0, 0];
          current[index] = value;
          newValue = { ...currentProp, k: current };
        } else {
          // Single value (rotation, opacity)
          newValue = { ...currentProp, k: value };
        }
        
        onPropertyChange(selectedLayerIndex, prop, newValue);
      }
    }
  };

  return (
    <div className="w-[320px] bg-gray-900 border-l border-gray-800 overflow-auto">
      <div className="p-4 space-y-6">
        {/* Layer Info */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">{selectedLayer.nm}</h3>
          <p className="text-xs text-gray-500">
            Type: {selectedLayer.ty === 0 ? 'Precomp' :
                   selectedLayer.ty === 1 ? 'Solid' :
                   selectedLayer.ty === 2 ? 'Image' :
                   selectedLayer.ty === 3 ? 'Null' :
                   selectedLayer.ty === 4 ? 'Shape' :
                   selectedLayer.ty === 5 ? 'Text' : 'Unknown'}
          </p>
        </div>

        <Separator className="bg-gray-800" />

        {/* Transform Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Transform</h3>
          <div className="space-y-4">
            {/* Position */}
            <div>
              <Label className="text-xs text-gray-400 mb-2 block">Position</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-gray-500 mb-1 block">X</Label>
                  <Input
                    type="number"
                    value={localValues.posX?.toFixed(2) || 0}
                    onChange={(e) => updateProperty('posX', parseFloat(e.target.value) || 0, 0)}
                    className="h-8 bg-gray-800 border-gray-700 text-gray-300 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-gray-500 mb-1 block">Y</Label>
                  <Input
                    type="number"
                    value={localValues.posY?.toFixed(2) || 0}
                    onChange={(e) => updateProperty('posY', parseFloat(e.target.value) || 0, 1)}
                    className="h-8 bg-gray-800 border-gray-700 text-gray-300 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Scale */}
            <div>
              <Label className="text-xs text-gray-400 mb-2 block">Scale</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-gray-500 mb-1 block">X</Label>
                  <Input
                    type="number"
                    value={localValues.scaleX?.toFixed(2) || 100}
                    onChange={(e) => updateProperty('scaleX', parseFloat(e.target.value) || 100, 0)}
                    className="h-8 bg-gray-800 border-gray-700 text-gray-300 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-gray-500 mb-1 block">Y</Label>
                  <Input
                    type="number"
                    value={localValues.scaleY?.toFixed(2) || 100}
                    onChange={(e) => updateProperty('scaleY', parseFloat(e.target.value) || 100, 1)}
                    className="h-8 bg-gray-800 border-gray-700 text-gray-300 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <Label className="text-xs text-gray-400 mb-2 block">Rotation (degrees)</Label>
              <Input
                type="number"
                value={localValues.rotation?.toFixed(2) || 0}
                onChange={(e) => updateProperty('rotation', parseFloat(e.target.value) || 0)}
                className="h-8 bg-gray-800 border-gray-700 text-gray-300 text-sm"
                placeholder="0°"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-gray-400">Opacity</Label>
                <span className="text-xs text-gray-500 font-mono">
                  {localValues.opacity?.toFixed(0) || 100}%
                </span>
              </div>
              <Slider 
                value={[localValues.opacity || 100]} 
                onValueChange={(value) => updateProperty('opacity', value[0])}
                max={100} 
                step={1} 
                className="w-full" 
              />
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Layer Timing */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Timing</h3>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>In Point:</span>
              <span className="text-gray-300">{selectedLayer.ip}</span>
            </div>
            <div className="flex justify-between">
              <span>Out Point:</span>
              <span className="text-gray-300">{selectedLayer.op}</span>
            </div>
            <div className="flex justify-between">
              <span>Start Time:</span>
              <span className="text-gray-300">{selectedLayer.st}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Additional Info */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Info</h3>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Index:</span>
              <span className="text-gray-300">{selectedLayer.ind}</span>
            </div>
            {selectedLayer.parent !== undefined && (
              <div className="flex justify-between">
                <span>Parent:</span>
                <span className="text-gray-300">{selectedLayer.parent}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
