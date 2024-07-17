// components/ColorPicker.js
import { ChromePicker } from 'react-color';

const ColorPicker = ({ color, onChange, label }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center">
        <div
          className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
          style={{ backgroundColor: color }}
        />
        <div className="ml-2">
          <ChromePicker color={color} onChange={(newColor) => onChange(newColor.hex)} />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;